import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { CharactersResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getWrpLive } from '../live/liveData';
import { getCharacterInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';
import { fetchFactions } from './factions';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { Video } from '../../db/entity/Video';
import { videoUrlOffset } from '../../utils';

export interface CharactersRequest {
    limit?: number;
    page?: number;
}

export const fetchCharacters = async (apiClient: ApiClient, dataSource: DataSource): Promise<CharactersResponse> => {
    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource);

    const liveData = await getWrpLive(apiClient, dataSource);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource);

    interface AggregateChunk {
        streamerId: string;
        characterId: number;
        streamStartDate: Date;
        firstSeenDate: Date;
        lastSeenDate: Date;
        spans: { title: string, start: string, end: string }[];
        videoUrl: string | null;
        videoThumbnailUrl: string | null;
    }

    const streamChunks = await dataSource
        .createQueryBuilder()
        .select('recent_chunk.streamer_id', 'streamerId')
        .addSelect('recent_chunk.character_id', 'characterId')
        .addSelect('recent_chunk.stream_start_date', 'streamStartDate')
        .addSelect('recent_chunk.first_seen_date', 'firstSeenDate')
        .addSelect('recent_chunk.last_seen_date', 'lastSeenDate')
        .addSelect('recent_chunk.spans', 'spans')
        .addSelect('video.url', 'videoUrl')
        .addSelect('video.thumbnailUrl', 'videoThumbnailUrl')
        .from(qb =>
            qb.subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.streamerId', 'streamer_id')
                .addSelect('stream_chunk.characterId', 'character_id')
                .addSelect('stream_chunk.streamStartDate', 'stream_start_date')
                .addSelect('stream_chunk.streamId', 'stream_id')
                .addSelect('MIN(stream_chunk.firstSeenDate)', 'first_seen_date')
                .addSelect('MAX(stream_chunk.lastSeenDate)', 'last_seen_date')
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
                .andWhere('stream_chunk.characterUncertain = false')
                .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
                .groupBy('stream_chunk.streamerId')
                .addGroupBy('stream_chunk.streamId')
                .addGroupBy('stream_chunk.characterId')
                .addGroupBy('stream_chunk.streamStartDate')
                .orderBy('character_id', 'ASC')
                .addOrderBy('last_seen_date', 'DESC'), 'recent_chunk')
        .leftJoin(Video, 'video', 'video.streamId = recent_chunk.stream_id')
        .execute() as AggregateChunk[];

    const seen: Record<string, Record<number, AggregateChunk>> = {};
    streamChunks.forEach((streamChunk) => {
        if (!streamChunk.characterId) {
            return;
        }
        if (!seen[streamChunk.streamerId]) {
            seen[streamChunk.streamerId] = {};
        }
        seen[streamChunk.streamerId][streamChunk.characterId] = streamChunk;
    });

    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));

    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
        const channelInfo = knownUsers.find(u =>
            u.displayName.toLowerCase() === streamer.toLowerCase()
            || u.login.toLowerCase() == streamer.toLowerCase());
        return characters
            .filter(character => character.assume !== 'neverNp')
            .map((character) => {
                const characterInfo = getCharacterInfo(streamer, character, channelInfo, factionMap);

                characterInfo.liveInfo = liveData.streams.find(s =>
                    s.channelName === streamer
                    && s.characterName === character.name);

                if (channelInfo?.id
                    && seen[channelInfo?.id]
                    && seen[channelInfo?.id][character.id]
                    && seen[channelInfo?.id][character.id].lastSeenDate.getTime() - seen[channelInfo?.id][character.id].firstSeenDate.getTime() > 1000 * 60 * 10
                ) {
                    const chunk = seen[channelInfo?.id][character.id];
                    characterInfo.lastSeenLive = chunk.lastSeenDate.toISOString();
                    characterInfo.lastSeenTitle = chunk.spans[0]?.title;
                    characterInfo.lastSeenVideoThumbnailUrl = chunk.videoThumbnailUrl ?? undefined;
                    if (chunk.videoUrl) {
                        characterInfo.lastSeenVideoUrl = videoUrlOffset(chunk.videoUrl, chunk.streamStartDate, chunk.firstSeenDate);
                    }
                }

                return characterInfo;
            });
    });

    return {
        factions: factionInfos,
        characters: characterInfos,
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchCharacters(apiClient, dataSource);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
