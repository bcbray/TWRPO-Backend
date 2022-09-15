import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { StreamersResponse, StreamerResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getWrpLive } from '../live/liveData';
import { getCharacterInfo } from '../../characterUtils';
import { fetchFactions } from './factions';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { Video } from '../../db/entity/Video';
import { TwitchUser } from '../../pfps';
import { videoUrlOffset } from '../../utils';

const charactersLookup = Object.fromEntries(
    Object.entries(wrpCharacters).map(([s, c]) => [s.toLowerCase(), c])
);

export const fetchStreamers = async (apiClient: ApiClient, dataSource: DataSource): Promise<StreamersResponse> => {
    const liveData = await getWrpLive(apiClient, dataSource);

    const liveDataLookup = Object.fromEntries(liveData.streams
        .map(s => [s.channelName.toLowerCase(), s]));

    const channels = await dataSource
        .getRepository(TwitchChannel)
        .find({ order: { twitchLogin: 'asc' } });

    return {
        streamers: channels.flatMap((channel) => {
            const channelLower = channel.displayName.toLowerCase();
            const characters = charactersLookup[channelLower]
                ?.filter(c => c.assume !== 'neverNp');
            if (!characters || characters.length === 0) {
                return [];
            }
            return [{
                twitchId: channel.twitchId,
                twitchLogin: channel.twitchLogin,
                displayName: channel.displayName,
                profilePhotoUrl: channel.profilePhotoUrl,
                liveInfo: liveDataLookup[channelLower],
            }];
        }),
    };
};

export interface FetchStreamerOptions {
    includeHiddenSegments?: boolean;
}

export const fetchStreamer = async (apiClient: ApiClient, dataSource: DataSource, login: string, options: FetchStreamerOptions = {}): Promise<StreamerResponse | null> => {
    const {
        includeHiddenSegments = false,
    } = options;
    const channel = await dataSource
        .getRepository(TwitchChannel)
        .findOne({ where: { twitchLogin: login.toLowerCase() } });

    if (!channel) {
        return null;
    }

    const entry = Object.entries(wrpCharacters)
        .find(([streamer]) => streamer.toLowerCase() === channel.twitchLogin.toLowerCase());

    const ignoredCharacters = entry
        ? entry[1].filter(character => character.assume === 'neverNp')
        : [];

    const rawCharacters = entry
        ? entry[1].filter(character => character.assume !== 'neverNp')
        : [];

    if (ignoredCharacters.length > 0 && rawCharacters.length === 0) {
        // If we only have explicitly-ignored characters, ignore this streamer
        return null;
    }

    const allSegments = await dataSource
        .getRepository(StreamChunk)
        .find({
            where: {
                streamerId: channel.twitchId,
                isHidden: includeHiddenSegments ? undefined : false,
            },
            relations: { video: true },
            order: {
                lastSeenDate: 'desc',
            },
            take: 24,
        });

    const now = new Date();

    const validSegments = allSegments.filter(chunk =>
        chunk.lastSeenDate.getTime() - chunk.firstSeenDate.getTime() > 1000 * 60 * 3
        || now.getTime() - chunk.lastSeenDate.getTime() < 1000 * 60 * 4);

    if (rawCharacters.length === 0 && validSegments.length === 0) {
        // If we have neither characters nor videos, ignore this streamer
        return null;
    }

    const liveData = await getWrpLive(apiClient, dataSource);

    const liveInfo = liveData.streams.find(s =>
        s.channelName === channel.displayName);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource);
    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));

    const channelInfo: TwitchUser = {
        id: channel.twitchId,
        login: channel.twitchLogin,
        displayName: channel.displayName,
        profilePictureUrl: channel.profilePhotoUrl,
        createdAt: channel.twitchCreatedAt,
    };

    interface AggregateChunk {
        mostRecentSegmentId: number;
        streamerId: string;
        characterId: number;
        streamId: string;
        streamStartDate: Date;
        firstSeenDate: Date;
        lastSeenDate: Date;
        spans: { title: string, start: string, end: string }[];
        videoUrl: string | null;
        videoThumbnailUrl: string | null;
    }

    const streamChunks = await dataSource
        .createQueryBuilder()
        .select('recent_chunk.id', 'mostRecentSegmentId')
        .addSelect('recent_chunk.streamer_id', 'streamerId')
        .addSelect('recent_chunk.character_id', 'characterId')
        .addSelect('recent_chunk.stream_id', 'streamId')
        .addSelect('recent_chunk.stream_start_date', 'streamStartDate')
        .addSelect('recent_chunk.first_seen_date', 'firstSeenDate')
        .addSelect('recent_chunk.last_seen_date', 'lastSeenDate')
        .addSelect('recent_chunk.spans', 'spans')
        .addSelect('video.url', 'videoUrl')
        .addSelect('video.thumbnailUrl', 'videoThumbnailUrl')
        .from((qb) => {
            const subQuery = qb.subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.streamerId', 'streamer_id')
                .addSelect('stream_chunk.characterId', 'character_id')
                .addSelect('stream_chunk.streamStartDate', 'stream_start_date')
                .addSelect('stream_chunk.streamId', 'stream_id')
                .addSelect('MIN(stream_chunk.firstSeenDate)', 'first_seen_date')
                .addSelect('MAX(stream_chunk.lastSeenDate)', 'last_seen_date')
                .addSelect('MAX(stream_chunk.id)', 'id')
                .addSelect(`
                    jsonb_agg(
                        jsonb_build_object(
                          'title', stream_chunk.title,
                          'start', stream_chunk.firstSeenDate,
                          'end', stream_chunk.lastSeenDate)
                      )
                `, 'spans')
                .distinctOn(['stream_chunk.characterId'])
                .where('stream_chunk.characterId IS NOT NULL')
                .andWhere('stream_chunk.streamerId = :streamerId', { streamerId: channel.twitchId })
                .andWhere('stream_chunk.characterUncertain = false')
                .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
                .groupBy('stream_chunk.streamerId')
                .addGroupBy('stream_chunk.streamId')
                .addGroupBy('stream_chunk.characterId')
                .addGroupBy('stream_chunk.streamStartDate')
                .orderBy('character_id', 'ASC')
                .addOrderBy('last_seen_date', 'DESC');

            if (!includeHiddenSegments) {
                subQuery.andWhere('stream_chunk.isHidden = false');
            }

            return subQuery;
        }, 'recent_chunk')
        .leftJoin(Video, 'video', 'video.streamId = recent_chunk.stream_id')
        .execute() as AggregateChunk[];

    const seen: Record<number, AggregateChunk> = {};
    streamChunks.forEach((streamChunk) => {
        if (!streamChunk.characterId) {
            return;
        }
        seen[streamChunk.characterId] = streamChunk;
    });

    const characterInfos = rawCharacters
        .map((character) => {
            const characterInfo = getCharacterInfo(channel.displayName, character, channelInfo, factionMap);
            if (liveInfo && liveInfo.characterId === character.id) {
                characterInfo.liveInfo = liveInfo;
            }
            if (seen[character.id]
                && seen[character.id].lastSeenDate.getTime() - seen[character.id].firstSeenDate.getTime() > 1000 * 60 * 10
            ) {
                const chunk = seen[character.id];
                characterInfo.lastSeenLive = chunk.lastSeenDate.toISOString();
                characterInfo.lastSeenTitle = chunk.spans[0]?.title;
                characterInfo.lastSeenVideoThumbnailUrl = chunk.videoThumbnailUrl ?? undefined;
                characterInfo.lastSeenSegmentId = chunk.mostRecentSegmentId;
                if (chunk.videoUrl) {
                    characterInfo.lastSeenVideoUrl = videoUrlOffset(chunk.videoUrl, chunk.streamStartDate, chunk.firstSeenDate);
                }
            }
            return characterInfo;
        });

    const characterLookup = Object.fromEntries(characterInfos.map(c => [c.id, c]));

    return {
        streamer: {
            twitchId: channel.twitchId,
            twitchLogin: channel.twitchLogin,
            displayName: channel.displayName,
            profilePhotoUrl: channel.profilePhotoUrl,
            liveInfo,
        },
        characters: characterInfos,
        recentSegments: validSegments
            .map((segment, idx) => {
                const url = segment.video
                    ? videoUrlOffset(segment.video.url, segment.streamStartDate, segment.firstSeenDate)
                    : undefined;
                return {
                    id: segment.id,
                    title: segment.title,
                    url,
                    thumbnailUrl: segment.video?.thumbnailUrl,
                    startDate: segment.firstSeenDate.toISOString(),
                    endDate: segment.lastSeenDate.toISOString(),
                    character: segment.characterId ? characterLookup[segment.characterId] : undefined,
                    characterUncertain: segment.characterUncertain,
                    liveInfo: liveInfo && liveInfo.streamId === segment.streamId && idx === 0
                        ? liveInfo
                        : undefined,
                    streamId: segment.streamId,
                };
            }),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchStreamers(apiClient, dataSource);
        return res.send(response);
    });

    router.get('/:login', async (req, res) => {
        const { login } = req.params;
        const response = await fetchStreamer(apiClient, dataSource, login);
        if (!response) {
            return res
                .status(404)
                .send({ success: false, errors: [{ message: `Streamer '${login}' not found` }] });
        }
        return res.send(response);
    });

    return router;
};

export default buildRouter;
