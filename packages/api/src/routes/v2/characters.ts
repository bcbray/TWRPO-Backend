import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { CharactersResponse, UserResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getFilteredWrpLive } from '../live/liveData';
import { getCharacterInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';
import { fetchFactions } from './factions';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { Video } from '../../db/entity/Video';
import { Server } from '../../db/entity/Server';
import { videoUrlOffset } from '../../utils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import {
    queryParamBoolean,
    queryParamString,
    ParamError,
} from '../../queryParams';

export interface CharactersParams {
    live?: boolean;
    search?: string;
    factionKey?: string;
    channelTwitchId?: string;
}

export const fetchCharacters = async (apiClient: ApiClient, dataSource: DataSource, params: CharactersParams = {}, currentUser: UserResponse): Promise<CharactersResponse> => {
    const {
        live,
        search,
        factionKey,
        channelTwitchId,
    } = params;
    console.log(params);

    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource);

    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource, currentUser);

    interface AggregateChunk {
        mostRecentSegmentId: number;
        serverId: number;
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
        .addSelect('recent_chunk.server_id', 'serverId')
        .addSelect('recent_chunk.streamer_id', 'streamerId')
        .addSelect('recent_chunk.character_id', 'characterId')
        .addSelect('recent_chunk.stream_id', 'streamId')
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
                .addSelect('stream_chunk.serverId', 'server_id')
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
                .distinctOn(['stream_chunk.serverId', 'stream_chunk.characterId'])
                .where('stream_chunk.characterId IS NOT NULL')
                .andWhere('stream_chunk.characterUncertain = false')
                .andWhere('stream_chunk.isHidden = false')
                .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
                .groupBy('stream_chunk.serverId')
                .addGroupBy('stream_chunk.streamerId')
                .addGroupBy('stream_chunk.streamId')
                .addGroupBy('stream_chunk.characterId')
                .addGroupBy('stream_chunk.streamStartDate')
                .orderBy('server_id', 'ASC')
                .addOrderBy('character_id', 'ASC')
                .addOrderBy('last_seen_date', 'DESC'), 'recent_chunk')
        .leftJoin(Video, 'video', 'video.streamId = recent_chunk.stream_id')
        .innerJoin(Server, 'server', 'server.id = recent_chunk.server_id')
        .where('server.key = \'wrp\'')
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

    const allCharacterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
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
                    characterInfo.lastSeenSegmentId = chunk.mostRecentSegmentId;
                    if (chunk.videoUrl) {
                        characterInfo.lastSeenVideoUrl = videoUrlOffset(chunk.videoUrl, chunk.streamStartDate, chunk.firstSeenDate);
                    }
                }

                return characterInfo;
            });
    });

    // live,
    // search,
    // factionKey,
    // channelTwitchId,
    // cursor,
    // limit = DEFAULT_LIMIT,

    const searchRegex = search
        ? new RegExp(
            RegExp.escape(search)
                .replaceAll(/['‘’]/g, '[‘’\']')
                .replaceAll(/["“”]/g, '[“”"]'),
            'i'
        )
        : undefined;

    const filteredCharacterInfos = live || searchRegex || factionKey || channelTwitchId
        ? allCharacterInfos
            .filter(character =>
                ((live && character.liveInfo) || !live)
                    && ((searchRegex
                        && (searchRegex.test(character.channelName)
                            || searchRegex.test(character.name)
                            // TODO: nicknameLookup
                            || character.displayInfo.nicknames.some(n => searchRegex.test(n))
                            || character.factions.some(f => searchRegex.test(f.name)))
                    ) || !searchRegex)
                    && ((factionKey
                        && (character.factions.some(faction => faction.key === factionKey))
                    ) || !factionKey)
                    && ((channelTwitchId
                        && (character.channelInfo && character.channelInfo.id === channelTwitchId)
                    ) || !channelTwitchId))
        : allCharacterInfos;

    return {
        factions: factionInfos,
        characters: filteredCharacterInfos,
    };
};

export const parseCharactersQuery = (query: Request['query'] | URLSearchParams): CharactersParams | { error: string } => {
    const params: CharactersParams = {};
    try {
        params.live = queryParamBoolean(query, 'live');
        params.factionKey = queryParamString(query, 'factionKey');
        params.channelTwitchId = queryParamString(query, 'channelTwitchId');
        params.search = queryParamString(query, 'search');
    } catch (error) {
        if (error instanceof ParamError) {
            return { error: '`cursor` parameter must be a string' };
        }
        throw error;
    }
    return params;
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const params = parseCharactersQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchCharacters(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
