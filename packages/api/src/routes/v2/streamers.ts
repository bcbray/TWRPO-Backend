import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { StreamersResponse, StreamerResponse, UserResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getFilteredWrpLive } from '../live/liveData';
import { getCharacterInfo } from '../../characterUtils';
import { fetchFactions } from './factions';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { TwitchUser } from '../../pfps';
import { videoUrlOffset } from '../../utils';
import { isEditorForTwitchId } from '../../userUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { chunkIsShorterThanMinimum, chunkIsRecent } from '../../segmentUtils';

const charactersLookup = Object.fromEntries(
    Object.entries(wrpCharacters).map(([s, c]) => [s.toLowerCase(), c])
);

export const fetchStreamers = async (apiClient: ApiClient, dataSource: DataSource, currentUser: UserResponse): Promise<StreamersResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);

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

export const fetchStreamer = async (apiClient: ApiClient, dataSource: DataSource, login: string, currentUser: UserResponse): Promise<StreamerResponse | null> => {
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

    const includeHiddenSegments = isEditorForTwitchId(channel.twitchId, currentUser);

    const allSegments = await dataSource
        .getRepository(StreamChunk)
        .find({
            where: {
                streamerId: channel.twitchId,
                isHidden: includeHiddenSegments ? undefined : false,
                server: { key: 'wrp' },
            },
            relations: { video: true },
            order: {
                lastSeenDate: 'desc',
            },
            take: 24,
        });

    const validSegments = allSegments
        .map(chunk => ({
            ...chunk,
            isTooShort: chunkIsShorterThanMinimum(chunk) && !chunkIsRecent(chunk),
        }))
        .filter(chunk => includeHiddenSegments || !chunk.isTooShort);

    if (rawCharacters.length === 0 && validSegments.length === 0) {
        // If we have neither characters nor videos, ignore this streamer
        return null;
    }

    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);

    const liveInfo = liveData.streams.find(s =>
        s.channelName === channel.displayName);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource, currentUser);
    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));

    const channelInfo: TwitchUser = {
        id: channel.twitchId,
        login: channel.twitchLogin,
        displayName: channel.displayName,
        profilePictureUrl: channel.profilePhotoUrl,
        createdAt: channel.twitchCreatedAt,
    };

    const recentSegmentsQueryBuilder = dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .distinctOn(['stream_chunk.serverId', 'stream_chunk.streamerId', 'stream_chunk.characterId'])
        .leftJoinAndSelect('stream_chunk.video', 'video')
        .where('stream_chunk.streamerId = :streamerId', { streamerId: channel.twitchId })
        .andWhere('stream_chunk.characterId IS NOT NULL')
        .andWhere('stream_chunk.characterUncertain = false')
        .orderBy('stream_chunk.serverId', 'ASC')
        .addOrderBy('stream_chunk.streamerId', 'ASC')
        .addOrderBy('stream_chunk.characterId', 'ASC')
        .addOrderBy('stream_chunk.lastSeenDate', 'DESC');

    if (!includeHiddenSegments) {
        recentSegmentsQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const recentSegments = await recentSegmentsQueryBuilder.getMany();

    const seen: Record<number, StreamChunk> = Object.fromEntries(
        recentSegments.map(streamChunk => [streamChunk.characterId, streamChunk])
    );

    interface CharacterDuration {
        streamerId: string,
        serverId: number;
        characterId: number;
        duration: number;
        firstSeenDate: Date;
    }

    const durationsQueryBuilder = dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .select('stream_chunk.streamerId', 'streamerId')
        .addSelect('stream_chunk.serverId', 'serverId')
        .addSelect('stream_chunk.characterId', 'characterId')
        .addSelect('EXTRACT(\'epoch\' FROM SUM(stream_chunk.lastSeenDate - stream_chunk.firstSeenDate))::int', 'duration')
        .addSelect('MIN(stream_chunk.firstSeenDate)', 'firstSeenDate')
        .where('stream_chunk.streamerId = :streamerId', { streamerId: channel.twitchId })
        .andWhere('stream_chunk.characterId IS NOT NULL')
        .andWhere('stream_chunk.characterUncertain = false')
        .groupBy('stream_chunk.serverId')
        .addGroupBy('stream_chunk.characterId')
        .addGroupBy('stream_chunk.streamerId');

    if (!includeHiddenSegments) {
        durationsQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const durations: CharacterDuration[] = await durationsQueryBuilder.execute();

    const durationLookup: Record<number, CharacterDuration> = Object.fromEntries(
        durations.map(duration => [duration.characterId, duration])
    );

    interface StreamStats {
        avgStreamStartTimeOffest: number;
    }

    const averageStartTimeQueryBuilder = dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .select('ROUND(EXTRACT(\'epoch\' FROM AVG(stream_chunk.streamStartDate ::time)))::int', 'avgStreamStartTimeOffest')
        .where('stream_chunk.streamerId = :streamerId', { streamerId: channel.twitchId })
        .groupBy('stream_chunk.streamerId');

    if (!includeHiddenSegments) {
        averageStartTimeQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const averageStartTime: StreamStats[] = await averageStartTimeQueryBuilder.execute();

    const averageStreamStartTimeOffset = averageStartTime.length > 0
        ? averageStartTime[0].avgStreamStartTimeOffest
        : undefined;

    const characterInfos = rawCharacters
        .map((character) => {
            const characterInfo = getCharacterInfo(channel.displayName, character, channelInfo, factionMap);
            if (liveInfo && liveInfo.characterId === character.id) {
                characterInfo.liveInfo = liveInfo;
            }
            if (seen[character.id]) {
                const chunk = seen[character.id];
                characterInfo.lastSeenLive = chunk.lastSeenDate.toISOString();
                characterInfo.lastSeenTitle = chunk.title;
                characterInfo.lastSeenVideoThumbnailUrl = chunk.video?.thumbnailUrl;
                characterInfo.lastSeenSegmentId = chunk.id;
                if (chunk.video?.url) {
                    characterInfo.lastSeenVideoUrl = videoUrlOffset(chunk.video.url, chunk.streamStartDate, chunk.firstSeenDate);
                }

                if (durationLookup[character.id]) {
                    const { duration, firstSeenDate } = durationLookup[character.id];
                    characterInfo.totalSeenDuration = duration;
                    characterInfo.firstSeenLive = firstSeenDate.toISOString();
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
            averageStreamStartTimeOffset,
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
                    streamStartDate: segment.streamStartDate.toISOString(),
                    character: segment.characterId ? characterLookup[segment.characterId] : null,
                    characterUncertain: segment.characterUncertain,
                    liveInfo: liveInfo && liveInfo.streamId === segment.streamId && idx === 0
                        ? liveInfo
                        : undefined,
                    streamId: segment.streamId,
                    isHidden: segment.isHidden,
                    isTooShort: segment.isTooShort,
                };
            }),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchStreamers(apiClient, dataSource, userResponse);
        return res.send(response);
    });

    router.get('/:login', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const { login } = req.params;
        const response = await fetchStreamer(apiClient, dataSource, login, userResponse);
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
