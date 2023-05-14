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
import { Server } from '../../db/entity/Server';
import { videoUrlOffset } from '../../utils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { isGlobalEditor } from '../../userUtils';
import {
    queryParamBoolean,
    queryParamString,
    queryParamInteger,
    ParamError,
} from '../../queryParams';
import { Logger } from '../../logger';

export interface CharactersParams {
    live?: boolean;
    search?: string;
    factionKey?: string;
    channelTwitchId?: string;

    serverKey?: string;
    serverId?: number;
    /** Temporary flag to opt new clients out of compatibility mode */
    tempAllowNoServer?: boolean;
}

export const fetchCharacters = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    params: CharactersParams = {},
    currentUser: UserResponse
): Promise<CharactersResponse> => {
    const {
        live,
        search,
        factionKey,
        channelTwitchId,
        serverKey: propsServerKey,
        serverId,
        tempAllowNoServer,
    } = params;

    // TODO: Temporary fallback values until we’re confident old clients are longer out in the wild
    const hasServerParam = (tempAllowNoServer === true || propsServerKey !== undefined || serverId !== undefined);
    const serverKey = hasServerParam ? propsServerKey : 'wrp';

    const server = await dataSource.getRepository(Server)
        .findOne({ where: { id: serverId, key: serverKey } });

    if (!server) {
        // TODO: Send a 404
        return { factions: [], characters: [] };
    }

    if (server.key !== 'wrp') {
        // We don’t have characters for other servers
        return { factions: [], characters: [] };
    }

    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource, logger);

    const liveData = await getFilteredWrpLive(apiClient, dataSource, logger, currentUser);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource, logger, { serverId: server.id }, currentUser);

    const includeHiddenSegments = isGlobalEditor(currentUser);

    const recentSegmentsQueryBuilder = dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .distinctOn(['stream_chunk.serverId', 'stream_chunk.streamerId', 'stream_chunk.characterId'])
        .leftJoinAndSelect('stream_chunk.video', 'video')
        .innerJoin(Server, 'server', 'server.id = stream_chunk.serverId')
        .where('server.key = \'wrp\'')
        .andWhere('stream_chunk.characterId IS NOT NULL')
        .andWhere('stream_chunk.characterUncertain = false')
        .orderBy('stream_chunk.serverId', 'ASC')
        .addOrderBy('stream_chunk.streamerId', 'ASC')
        .addOrderBy('stream_chunk.characterId', 'ASC')
        .addOrderBy('stream_chunk.lastSeenDate', 'DESC');

    if (channelTwitchId) {
        recentSegmentsQueryBuilder
            .andWhere('stream_chunk.streamerId = :channelTwitchId', { channelTwitchId });
    }

    if (!includeHiddenSegments) {
        recentSegmentsQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const recentSegments = await recentSegmentsQueryBuilder.getMany();

    const seen: Record<string, Record<number, StreamChunk>> = {};
    recentSegments.forEach((streamChunk) => {
        if (!streamChunk.characterId) {
            return;
        }
        if (!seen[streamChunk.streamerId]) {
            seen[streamChunk.streamerId] = {};
        }
        seen[streamChunk.streamerId][streamChunk.characterId] = streamChunk;
    });

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
        .innerJoin(Server, 'server', 'server.id = stream_chunk.serverId')
        .where('server.key = \'wrp\'')
        .andWhere('stream_chunk.characterId IS NOT NULL')
        .andWhere('stream_chunk.characterUncertain = false')
        .groupBy('stream_chunk.serverId')
        .addGroupBy('stream_chunk.characterId')
        .addGroupBy('stream_chunk.streamerId');

    if (channelTwitchId) {
        durationsQueryBuilder
            .andWhere('stream_chunk.streamerId = :channelTwitchId', { channelTwitchId });
    }

    if (!includeHiddenSegments) {
        durationsQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const durations: CharacterDuration[] = await durationsQueryBuilder.execute();

    const durationLookup: Record<string, Record<number, CharacterDuration>> = {};
    durations.forEach((duration) => {
        if (!durationLookup[duration.streamerId]) {
            durationLookup[duration.streamerId] = {};
        }
        durationLookup[duration.streamerId][duration.characterId] = duration;
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
                ) {
                    const chunk = seen[channelInfo?.id][character.id];
                    characterInfo.lastSeenLive = chunk.lastSeenDate.toISOString();
                    characterInfo.lastSeenTitle = chunk.title;
                    characterInfo.lastSeenVideoThumbnailUrl = chunk.video?.thumbnailUrl;
                    characterInfo.lastSeenSegmentId = chunk.id;
                    if (chunk.video?.url) {
                        characterInfo.lastSeenVideoUrl = videoUrlOffset(chunk.video.url, chunk.streamStartDate, chunk.firstSeenDate);
                    }
                }

                if (channelInfo?.id
                    && durationLookup[channelInfo?.id]
                    && durationLookup[channelInfo?.id][character.id]
                ) {
                    const { duration, firstSeenDate } = durationLookup[channelInfo?.id][character.id];
                    characterInfo.totalSeenDuration = duration;
                    characterInfo.firstSeenLive = firstSeenDate.toISOString();
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
                            || character.factions.some(f => searchRegex.test(f.name))
                            || (character.contact && searchRegex.test(character.contact)))
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
        params.serverKey = queryParamString(query, 'serverKey');
        params.serverId = queryParamInteger(query, 'serverId');
        params.tempAllowNoServer = queryParamBoolean(query, 'tempAllowNoServer');
    } catch (error) {
        if (error instanceof ParamError) {
            return { error: '`cursor` parameter must be a string' };
        }
        throw error;
    }
    return params;
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const params = parseCharactersQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchCharacters(apiClient, dataSource, logger, params, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
