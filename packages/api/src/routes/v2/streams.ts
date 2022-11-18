import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource, In } from 'typeorm';
import { StreamsResponse, SegmentAndStreamer, UserResponse } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { fetchCharacters } from './characters';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { Video } from '../../db/entity/Video';
import { Server } from '../../db/entity/Server';
import { Game } from '../../db/entity/Game';
import { videoUrlOffset } from '../../utils';
import { isEditorForTwitchId, isGlobalEditor } from '../../userUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { minimumSegmentLengthMinutes, chunkIsShorterThanMinimum } from '../../segmentUtils';
import {
    queryParamBoolean,
    queryParamDate,
    queryParamString,
    queryParamInteger,
    ParamError,
} from '../../queryParams';

export const fetchLiveStreams = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    params: Pick<StreamsParams, 'search' | 'factionKey' | 'channelTwitchId' | 'serverKey' | 'serverId' | 'gameKey' | 'tempAllowNoServer'> = {},
    userResponse: UserResponse
): Promise<StreamsResponse> => {
    const {
        factionKey,
        channelTwitchId,
        search,
        serverKey: propsServerKey,
        serverId,
        tempAllowNoServer,
        gameKey: propsGameKey,
    } = params;
    // TODO: Temporary fallback values until we’re confident old clients are longer out in the wild
    const hasServerOrGameParam = (tempAllowNoServer === true || propsServerKey !== undefined || serverId !== undefined || propsGameKey !== undefined);
    const serverKey = hasServerOrGameParam ? propsServerKey : 'wrp';
    const gameKey = hasServerOrGameParam ? propsGameKey : 'rdr2';

    const searchRegex = search
        ? new RegExp(
            RegExp.escape(search)
                .replaceAll(/['‘’]/g, '[‘’\']')
                .replaceAll(/["“”]/g, '[“”"]'),
            'i'
        )
        : undefined;

    const searchTextLookup = search
        ? search
            .replace(/^\W+|\W+$|[^\w\s]+/g, ' ')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .trim()
        : undefined;

    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);

    const streams = searchRegex || factionKey || channelTwitchId
        ? liveData.streams.filter(stream =>
            ((channelTwitchId
                && stream.channelTwitchId === channelTwitchId
            ) || !channelTwitchId)
            && ((searchRegex
                && (
                    searchRegex.test(stream.tagText)
                    || (stream.characterName && searchRegex.test(stream.characterName))
                    || (searchTextLookup && stream.nicknameLookup && stream.nicknameLookup.includes(searchTextLookup))
                    || (stream.characterContact && searchRegex.test(stream.characterContact))
                    || searchRegex.test(stream.channelName)
                    || searchRegex.test(stream.title)
                    || stream.factions.some(f => searchRegex.test(f))
                )
            ) || !searchRegex)
            && ((factionKey
                && stream.factionsMap[factionKey]
            ) || !factionKey))
        : liveData.streams;

    const liveSegmentIds = streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveDataSegmentIdLookup = Object.fromEntries(streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));
    const liveDataTwitchUserIdLookup = Object.fromEntries(streams
        .map(s => [s.channelTwitchId, s]));

    const characters = await fetchCharacters(apiClient, dataSource, {}, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );
    const segments = liveSegmentIds.length > 0
        ? await dataSource.getRepository(StreamChunk)
            .find({
                where: {
                    id: In(liveSegmentIds),
                    server: serverKey || serverId ? { key: serverKey, id: serverId } : undefined,
                    game: gameKey ? { key: gameKey } : undefined,
                },
                order: {
                    lastViewerCount: 'desc',
                    channel: { twitchLogin: 'desc' },
                },
                relations: {
                    video: true,
                    channel: true,
                    server: true,
                    game: true,
                },
            })
        : [];

    const segmentAndStreamer = (segment: StreamChunk): SegmentAndStreamer => {
        const url = segment.video
            ? videoUrlOffset(segment.video.url, segment.streamStartDate, segment.firstSeenDate)
            : undefined;
        return {
            streamer: {
                twitchId: segment.channel!.twitchId,
                twitchLogin: segment.channel!.twitchLogin,
                displayName: segment.channel!.displayName,
                profilePhotoUrl: segment.channel!.profilePhotoUrl,
                liveInfo: liveDataTwitchUserIdLookup[segment.channel!.twitchId],
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: liveDataSegmentIdLookup[segment.id]?.thumbnailUrl ?? segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                streamStartDate: segment.streamStartDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataSegmentIdLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: false, // Live streams are never excluded for length
                server: segment.server ? {
                    id: segment.server.id,
                    key: segment.server.key ?? undefined,
                    name: segment.server.name,
                    tagName: segment.server.tagName,
                    isVisible: segment.server.isVisible,
                    isRoleplay: segment.server.isRoleplay,
                } : undefined,
                game: {
                    id: segment.game!.id,
                    key: segment.game!.key ?? undefined,
                    name: segment.game!.name,
                },
            },
        };
    };

    return {
        streams: segments
            .filter(s => s.channel && s.game)
            .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
            .map(segmentAndStreamer),
        lastRefreshTime: new Date(liveData.tick).toISOString(),
    };
};

export interface RecentStreamsCursor {
    before: Date;
}

export interface StreamsParams {
    live?: boolean;
    distinctCharacters?: boolean;
    search?: string;
    factionKey?: string;
    channelTwitchId?: string;
    startBefore?: Date;
    startAfter?: Date;
    endBefore?: Date;
    endAfter?: Date;
    serverKey?: string;
    serverId?: number;
    /** Temporary flag to opt new clients out of compatibility mode */
    tempAllowNoServer?: boolean;
    gameKey?: string;
    limit?: number;
    cursor?: RecentStreamsCursor;
}

export const serializeRecentStreamsCursor = (cursor: RecentStreamsCursor): string =>
    btoa(
        JSON.stringify(cursor)
    ).replaceAll('+', '.').replaceAll('/', '_').replaceAll('=', '-');

export const deserializeRecentStreamsCursor = (cursor: string): RecentStreamsCursor | null => {
    try {
        const parsed = JSON.parse(
            atob(
                cursor.replaceAll('-', '=').replaceAll('_', '/').replaceAll('.', '+')
            )
        );
        if (typeof parsed !== 'object') {
            return null;
        }
        if (!('before' in parsed)) {
            return null;
        }
        if (typeof parsed.before !== 'string') {
            return null;
        }
        const before = new Date(parsed.before);
        if (Number.isNaN(before.getTime())) {
            return null;
        }
        return { before };
    } catch (error) {
        if (error instanceof SyntaxError) {
            return null;
        }
        if (error instanceof DOMException) {
            return null;
        }
        throw error;
    }
};

type Raw<Type> = {
    [Property in keyof Type]: Type[Property] extends Date ? string : Type[Property];
};

const DEFAULT_LIMIT = 24;

export const fetchRecentStreams = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    params: StreamsParams = {},
    userResponse: UserResponse
): Promise<StreamsResponse> => {
    const {
        distinctCharacters = true,
        factionKey,
        channelTwitchId,
        search,
        startBefore,
        startAfter,
        endBefore,
        endAfter,
        serverKey: propsServerKey,
        serverId,
        gameKey: propsGameKey,
        tempAllowNoServer,
        cursor,
        limit = DEFAULT_LIMIT,
    } = params;
    // TODO: Temporary fallback values until we’re confident old clients are longer out in the wild
    const hasServerOrGameParam = (tempAllowNoServer === true || propsServerKey !== undefined || serverId !== undefined || propsGameKey !== undefined);
    const serverKey = hasServerOrGameParam ? propsServerKey : 'wrp';
    const gameKey = hasServerOrGameParam ? propsGameKey : 'rdr2';

    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveCharacterIds = liveData.streams.flatMap(s => (s.characterId ? [s.characterId] : []));
    const liveDataTwitchUserIdLookup = Object.fromEntries(liveData.streams
        .map(s => [s.channelTwitchId, s]));
    const lastRefreshTime = new Date(liveData.tick).toISOString();

    const characters = await fetchCharacters(apiClient, dataSource, {}, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

    const searchRegex = search
        ? new RegExp(
            RegExp.escape(search)
                .replaceAll(/['‘’]/g, '[‘’\']')
                .replaceAll(/["“”]/g, '[“”"]'),
            'i'
        )
        : undefined;

    const filteredCharacterIds = factionKey
        ? characters.characters.filter(c => c.factions.some(f => f.key === factionKey)).map(c => c.id)
        : undefined;

    if (filteredCharacterIds && filteredCharacterIds.length === 0) {
        return { streams: [], nextCursor: undefined, lastRefreshTime };
    }

    const searchCharacterIds = searchRegex
        ? characters.characters
            .filter(character =>
                searchRegex.test(character.channelName)
                || searchRegex.test(character.name)
                // TODO: nicknameLookup
                || character.displayInfo.nicknames.some(n => searchRegex.test(n))
                || character.factions.some(f => searchRegex.test(f.name))
                || (character.contact && searchRegex.test(character.contact)))
            .map(c => c.id)
        : undefined;

    const queryBuilder = dataSource
        .createQueryBuilder()
        .select('*')
        .from((qb) => {
            const subQuery = qb
                .subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.id', 'id')
                .addSelect('stream_chunk.serverId', 'serverId')
                .addSelect('stream_chunk.gameTwitchId', 'gameTwitchId')
                .addSelect('stream_chunk.characterId', 'characterId')
                .addSelect('stream_chunk.characterUncertain', 'characterUncertain')
                .addSelect('stream_chunk.streamerId', 'streamerId')
                .addSelect('stream_chunk.streamId', 'streamId')
                .addSelect('stream_chunk.streamStartDate', 'streamStartDate')
                .addSelect('stream_chunk.title', 'title')
                .addSelect('stream_chunk.firstSeenDate', 'firstSeenDate')
                .addSelect('stream_chunk.lastSeenDate', 'lastSeenDate')
                .addSelect('stream_chunk.lastViewerCount', 'lastViewerCount')
                .addSelect('stream_chunk.isOverridden', 'isOverridden')
                .addSelect('stream_chunk.isHidden', 'isHidden')
                .where('true')
                .orderBy('stream_chunk.serverId', 'ASC')
                .addOrderBy('stream_chunk.characterId', 'ASC')
                .addOrderBy('stream_chunk.lastSeenDate', 'DESC');

            if (distinctCharacters) {
                subQuery.distinctOn(['stream_chunk.serverId', 'stream_chunk.characterId']);
                if (liveCharacterIds.length) {
                    subQuery.andWhere('(stream_chunk.characterId IS NULL OR stream_chunk.characterId NOT IN (:...liveCharacterIds))', { liveCharacterIds });
                }
            }
            if (liveSegmentIds.length) {
                subQuery.andWhere('stream_chunk.id NOT IN (:...liveSegmentIds)', { liveSegmentIds });
            }

            if (filteredCharacterIds) {
                subQuery.andWhere('stream_chunk.characterId IS NOT NULL AND stream_chunk.characterId IN (:...filteredCharacterIds)', { filteredCharacterIds });
            }

            if (channelTwitchId) {
                subQuery.andWhere('stream_chunk.streamerId = :channelTwitchId', { channelTwitchId });
            }

            if (searchRegex) {
                const searchRegexSource = searchRegex.source;
                if (searchCharacterIds && searchCharacterIds.length > 0) {
                    subQuery.andWhere('(stream_chunk.characterId IN (:...searchCharacterIds) OR stream_chunk.title ~* :searchRegexSource)', { searchCharacterIds, searchRegexSource });
                } else {
                    subQuery.andWhere('stream_chunk.title ~* :searchRegexSource', { searchRegexSource });
                }
            }

            if (serverKey || serverId) {
                subQuery
                    .innerJoin(Server, 'server', 'server.id = stream_chunk.serverId');
                if (serverKey) {
                    subQuery
                        .andWhere('server.key = :serverKey', { serverKey });
                }
                if (serverId) {
                    subQuery
                        .andWhere('server.id = :serverId', { serverId });
                }
            }

            if (gameKey) {
                subQuery
                    .innerJoin(Game, 'game', 'game.twitchId = stream_chunk.gameTwitchId')
                    .andWhere('game.key = :gameKey', { gameKey });
            }

            if (!isGlobalEditor(userResponse)) {
                subQuery
                    .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate >= make_interval(mins => :minimumSegmentLengthMinutes)', { minimumSegmentLengthMinutes })
                    .andWhere('stream_chunk.isHidden = false');
            }
            return subQuery;
        }, 'recent_chunk')
        .orderBy('"lastSeenDate"', 'DESC')
        .limit(limit);

    if (cursor) {
        queryBuilder
            .andWhere('"lastSeenDate" < :cursorBefore::timestamp without time zone', { cursorBefore: cursor.before });
    }

    if (startBefore) {
        queryBuilder
            .andWhere('"firstSeenDate" < :startBefore::timestamp without time zone', { startBefore });
    }

    if (startAfter) {
        queryBuilder
            .andWhere('"firstSeenDate" > :startAfter::timestamp without time zone', { startAfter });
    }

    if (endBefore) {
        queryBuilder
            .andWhere('"lastSeenDate" < :endBefore::timestamp without time zone', { endBefore });
    }

    if (endAfter) {
        queryBuilder
            .andWhere('"lastSeenDate" > :endAfter::timestamp without time zone', { endAfter });
    }

    const sameLastDateQueryBuilder = queryBuilder.clone();

    const rawSegments: Raw<StreamChunk>[] = await queryBuilder.execute();
    const lastSegment = rawSegments.length > 0 ? rawSegments[rawSegments.length - 1] : undefined;
    if (lastSegment) {
        // Fetch any additional segments that share the same lastSeenDate with
        // the final segment from the primary query (otherwise they’ll be skipped)
        // when we fetch the next segment (where we’ll only include items
        // _before_ that final lastSeenDate)
        sameLastDateQueryBuilder
            .andWhere('"lastSeenDate" = :lastSegmentLastSeenDate::timestamp without time zone', { lastSegmentLastSeenDate: lastSegment.lastSeenDate })
            .andWhere('"id" NOT IN (:...alreadyFetchedStreamIds)', { alreadyFetchedStreamIds: rawSegments.map(s => s.id) });
        const sameDateRawSegments = await sameLastDateQueryBuilder.execute();
        rawSegments.push(...sameDateRawSegments);
    }

    const streamerIds = rawSegments.map(s => s.streamerId);
    const channels = streamerIds.length > 0
        ? await dataSource.getRepository(TwitchChannel).findBy({
            twitchId: In(streamerIds),
        })
        : [];
    const channelLookup = Object.fromEntries(channels.map(c => [c.twitchId, c]));

    const streamIds = rawSegments.map(s => s.streamId);
    const videos = streamIds.length > 0
        ? await dataSource.getRepository(Video).findBy({
            streamId: In(streamIds),
        })
        : [];
    const videoLookup = Object.fromEntries(videos.map(v => [v.streamId, v]));

    const gameTwitchIds = rawSegments.map(s => s.gameTwitchId);
    const games = gameTwitchIds.length > 0
        ? await dataSource.getRepository(Game).findBy({
            twitchId: In(gameTwitchIds),
        })
        : [];
    const gameLookup = Object.fromEntries(games.map(c => [c.twitchId, c]));

    const serverIds = rawSegments.map(s => s.serverId);
    const servers = serverIds.length > 0
        ? await dataSource.getRepository(Server).findBy({
            id: In(serverIds),
        })
        : [];
    const serverLookup = Object.fromEntries(servers.map(c => [c.id, c]));

    const rawToReal = (raw: Raw<StreamChunk>): StreamChunk => {
        const { streamStartDate, firstSeenDate, lastSeenDate, ...rest } = raw;
        return {
            channel: channelLookup[rest.streamerId],
            video: videoLookup[rest.streamId],
            server: rest.serverId ? serverLookup[rest.serverId] : undefined,
            game: gameLookup[rest.gameTwitchId],
            streamStartDate: new Date(streamStartDate),
            firstSeenDate: new Date(firstSeenDate),
            lastSeenDate: new Date(lastSeenDate),
            ...rest,
        };
    };

    const segments = rawSegments.map(rawToReal);

    const segmentAndStreamer = (segment: StreamChunk): SegmentAndStreamer => {
        const url = segment.video
            ? videoUrlOffset(segment.video.url, segment.streamStartDate, segment.firstSeenDate)
            : undefined;
        return {
            streamer: {
                twitchId: segment.channel!.twitchId,
                twitchLogin: segment.channel!.twitchLogin,
                displayName: segment.channel!.displayName,
                profilePhotoUrl: segment.channel!.profilePhotoUrl,
                liveInfo: liveDataTwitchUserIdLookup[segment.channel!.twitchId],
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                streamStartDate: segment.streamStartDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: chunkIsShorterThanMinimum(segment),
                server: segment.server ? {
                    id: segment.server.id,
                    key: segment.server.key ?? undefined,
                    name: segment.server.name,
                    tagName: segment.server.tagName,
                    isVisible: segment.server.isVisible,
                    isRoleplay: segment.server.isRoleplay,
                } : undefined,
                game: {
                    id: segment.game!.id,
                    key: segment.game!.key ?? undefined,
                    name: segment.game!.name,
                },
            },
        };
    };

    const streams = segments
        .filter(s => s.channel && s.game)
        .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
        .map(segmentAndStreamer);

    const nextCursor = rawSegments.length
        ? serializeRecentStreamsCursor({ before: new Date(rawSegments[rawSegments.length - 1].lastSeenDate) })
        : undefined;

    return { streams, nextCursor, lastRefreshTime };
};

export const fetchStreams = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    params: StreamsParams = {},
    userResponse: UserResponse
): Promise<StreamsResponse> => {
    const now = new Date();
    const {
        live = true,
        startBefore,
        startAfter,
        endBefore,
        cursor,
        limit = DEFAULT_LIMIT,
    } = params;
    let nextCursor: string | undefined;

    const streams: SegmentAndStreamer[] = [];

    const { streams: liveStreams, lastRefreshTime } = await fetchLiveStreams(apiClient, dataSource, params, userResponse);

    const includeLive = cursor === undefined
        && live
        && (endBefore === undefined || endBefore.getTime() < new Date(lastRefreshTime).getTime())
        && (startAfter === undefined || startAfter.getTime() < new Date(lastRefreshTime).getTime());

    if (includeLive) {
        if (startBefore || startAfter) {
            streams.push(...liveStreams.filter(({ segment }) => {
                const start = new Date(segment.startDate);
                return (startBefore === undefined || start.getTime() < startBefore.getTime())
                    && (startAfter === undefined || start.getTime() > startAfter.getTime());
            }));
        } else {
            streams.push(...liveStreams);
        }
    }

    if (streams.length < DEFAULT_LIMIT) {
        const {
            streams: recentStreams,
            nextCursor: recentNextCursor,
        } = await fetchRecentStreams(apiClient, dataSource, { ...params, limit: limit - streams.length }, userResponse);
        streams.push(...recentStreams);
        nextCursor = recentNextCursor;
    } else {
        nextCursor = serializeRecentStreamsCursor({ before: now });
    }

    return { streams, nextCursor, lastRefreshTime };
};

export const fetchUnknownStreams = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    params: StreamsParams = {},
    userResponse: UserResponse
): Promise<StreamsResponse> => {
    const {
        live,
        startBefore,
        startAfter,
        endBefore,
        endAfter,
        search,
        factionKey,
        channelTwitchId,
        serverKey: propsServerKey,
        serverId,
        gameKey: propsGameKey,
        tempAllowNoServer,
        cursor,
        limit = DEFAULT_LIMIT,
    } = params;
    // TODO: Temporary fallback values until we’re confident old clients are longer out in the wild
    const hasServerOrGameParam = (tempAllowNoServer === true || propsServerKey !== undefined || serverId !== undefined || propsGameKey !== undefined);
    const serverKey = hasServerOrGameParam ? propsServerKey : 'wrp';
    const gameKey = hasServerOrGameParam ? propsGameKey : 'rdr2';

    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveDataLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));
    const lastRefreshTime = new Date(liveData.tick).toISOString();

    const characters = await fetchCharacters(apiClient, dataSource, {}, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

    const searchRegex = search
        ? new RegExp(
            RegExp.escape(search)
                .replaceAll(/['‘’]/g, '[‘’\']')
                .replaceAll(/["“”]/g, '[“”"]'),
            'i'
        )
        : undefined;

    const filteredCharacterIds = factionKey
        ? characters.characters.filter(c => c.factions.some(f => f.key === factionKey)).map(c => c.id)
        : undefined;

    if (filteredCharacterIds && filteredCharacterIds.length === 0) {
        return { streams: [], nextCursor: undefined, lastRefreshTime };
    }

    const searchCharacterIds = searchRegex
        ? characters.characters
            .filter(character =>
                searchRegex.test(character.channelName)
                || searchRegex.test(character.name)
                // TODO: nicknameLookup
                || character.displayInfo.nicknames.some(n => searchRegex.test(n))
                || character.factions.some(f => searchRegex.test(f.name))
                || (character.contact && searchRegex.test(character.contact)))
            .map(c => c.id)
        : undefined;

    const queryBuilder = dataSource
        .createQueryBuilder()
        .select('*')
        .from((qb) => {
            const subQuery = qb
                .subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.id', 'id')
                .addSelect('stream_chunk.characterId', 'characterId')
                .addSelect('stream_chunk.serverId', 'serverId')
                .addSelect('stream_chunk.gameTwitchId', 'gameTwitchId')
                .addSelect('stream_chunk.characterUncertain', 'characterUncertain')
                .addSelect('stream_chunk.streamerId', 'streamerId')
                .addSelect('stream_chunk.streamId', 'streamId')
                .addSelect('stream_chunk.streamStartDate', 'streamStartDate')
                .addSelect('stream_chunk.title', 'title')
                .addSelect('stream_chunk.firstSeenDate', 'firstSeenDate')
                .addSelect('stream_chunk.lastSeenDate', 'lastSeenDate')
                .addSelect('stream_chunk.lastViewerCount', 'lastViewerCount')
                .addSelect('stream_chunk.isOverridden', 'isOverridden')
                .addSelect('stream_chunk.isHidden', 'isHidden')
                .where('(stream_chunk.characterId IS NULL OR (stream_chunk.characterId IS NOT NULL AND stream_chunk.characterUncertain = true))')
                .orderBy('stream_chunk.lastSeenDate', 'DESC');

            if (live === true) {
                subQuery.andWhere('stream_chunk.id IN (:...liveSegmentIds)', { liveSegmentIds });
            } else if (live === false) {
                subQuery.andWhere('stream_chunk.id NOT IN (:...liveSegmentIds)', { liveSegmentIds });
            }

            if (filteredCharacterIds) {
                subQuery.andWhere('stream_chunk.characterId IS NOT NULL AND stream_chunk.characterId IN (:...filteredCharacterIds)', { filteredCharacterIds });
            }

            if (channelTwitchId) {
                subQuery.andWhere('stream_chunk.streamerId = :channelTwitchId', { channelTwitchId });
            }

            if (searchRegex) {
                const searchRegexSource = searchRegex.source;
                if (searchCharacterIds && searchCharacterIds.length > 0) {
                    subQuery.andWhere('(stream_chunk.characterId IN (:...searchCharacterIds) OR stream_chunk.title ~* :searchRegexSource)', { searchCharacterIds, searchRegexSource });
                } else {
                    subQuery.andWhere('stream_chunk.title ~* :searchRegexSource', { searchRegexSource });
                }
            }

            if (serverKey || serverId) {
                subQuery
                    .innerJoin(Server, 'server', 'server.id = stream_chunk.serverId');
                if (serverKey) {
                    subQuery
                        .andWhere('server.key = :serverKey', { serverKey });
                }
                if (serverId) {
                    subQuery
                        .andWhere('server.id = :serverId', { serverId });
                }
            }

            if (gameKey) {
                subQuery
                    .innerJoin(Game, 'game', 'game.twitchId = stream_chunk.gameTwitchId')
                    .andWhere('game.key = :gameKey', { gameKey });
            }

            if (!isGlobalEditor(userResponse)) {
                subQuery.andWhere('stream_chunk.isHidden = false');
                if (liveSegmentIds.length) {
                    subQuery
                        .andWhere(
                            '(stream_chunk.lastSeenDate - stream_chunk.firstSeenDate >= make_interval(mins => :minimumSegmentLengthMinutes) OR stream_chunk.id IN (:...liveSegmentIds))',
                            { minimumSegmentLengthMinutes, liveSegmentIds }
                        );
                } else {
                    subQuery
                        .andWhere(
                            'stream_chunk.lastSeenDate - stream_chunk.firstSeenDate >= make_interval(mins => :minimumSegmentLengthMinutes)',
                            { minimumSegmentLengthMinutes }
                        );
                }
            }
            return subQuery;
        }, 'recent_chunk')
        .orderBy('"lastSeenDate"', 'DESC')
        .limit(limit);

    if (cursor) {
        queryBuilder
            .andWhere('"lastSeenDate" < :before::timestamp without time zone', { before: cursor.before });
    }

    if (startBefore) {
        queryBuilder
            .andWhere('"firstSeenDate" < :startBefore::timestamp without time zone', { startBefore });
    }

    if (startAfter) {
        queryBuilder
            .andWhere('"firstSeenDate" > :startAfter::timestamp without time zone', { startAfter });
    }

    if (endBefore) {
        queryBuilder
            .andWhere('"lastSeenDate" < :endBefore::timestamp without time zone', { endBefore });
    }

    if (endAfter) {
        queryBuilder
            .andWhere('"lastSeenDate" > :endAfter::timestamp without time zone', { endAfter });
    }

    const sameLastDateQueryBuilder = queryBuilder.clone();

    const rawSegments: Raw<StreamChunk>[] = await queryBuilder.execute();
    const lastSegment = rawSegments.length > 0 ? rawSegments[rawSegments.length - 1] : undefined;
    if (lastSegment) {
        // Fetch any additional segments that share the same lastSeenDate with
        // the final segment from the primary query (otherwise they’ll be skipped)
        // when we fetch the next segment (where we’ll only include items
        // _before_ that final lastSeenDate)
        sameLastDateQueryBuilder
            .andWhere('"lastSeenDate" = :lastSegmentLastSeenDate::timestamp without time zone', { lastSegmentLastSeenDate: lastSegment.lastSeenDate })
            .andWhere('"id" NOT IN (:...alreadyFetchedStreamIds)', { alreadyFetchedStreamIds: rawSegments.map(s => s.id) });
        const sameDateRawSegments = await sameLastDateQueryBuilder.execute();
        rawSegments.push(...sameDateRawSegments);
    }

    const streamerIds = rawSegments.map(s => s.streamerId);
    const channels = streamerIds.length > 0
        ? await dataSource.getRepository(TwitchChannel).findBy({
            twitchId: In(streamerIds),
        })
        : [];
    const channelLookup = Object.fromEntries(channels.map(c => [c.twitchId, c]));

    const streamIds = rawSegments.map(s => s.streamId);
    const videos = streamIds.length > 0
        ? await dataSource.getRepository(Video).findBy({
            streamId: In(streamIds),
        })
        : [];
    const videoLookup = Object.fromEntries(videos.map(v => [v.streamId, v]));

    const gameTwitchIds = rawSegments.map(s => s.gameTwitchId);
    const games = gameTwitchIds.length > 0
        ? await dataSource.getRepository(Game).findBy({
            twitchId: In(gameTwitchIds),
        })
        : [];
    const gameLookup = Object.fromEntries(games.map(c => [c.twitchId, c]));

    const serverIds = rawSegments.map(s => s.serverId);
    const servers = serverIds.length > 0
        ? await dataSource.getRepository(Server).findBy({
            id: In(serverIds),
        })
        : [];
    const serverLookup = Object.fromEntries(servers.map(c => [c.id, c]));

    const rawToReal = (raw: Raw<StreamChunk>): StreamChunk => {
        const { streamStartDate, firstSeenDate, lastSeenDate, ...rest } = raw;
        return {
            channel: channelLookup[rest.streamerId],
            video: videoLookup[rest.streamId],
            server: rest.serverId ? serverLookup[rest.serverId] : undefined,
            game: gameLookup[rest.gameTwitchId],
            streamStartDate: new Date(streamStartDate),
            firstSeenDate: new Date(firstSeenDate),
            lastSeenDate: new Date(lastSeenDate),
            ...rest,
        };
    };

    const segments = rawSegments.map(rawToReal);

    const segmentAndStreamer = (segment: StreamChunk): SegmentAndStreamer => {
        const url = segment.video
            ? videoUrlOffset(segment.video.url, segment.streamStartDate, segment.firstSeenDate)
            : undefined;
        return {
            streamer: {
                twitchId: segment.channel!.twitchId,
                twitchLogin: segment.channel!.twitchLogin,
                displayName: segment.channel!.displayName,
                profilePhotoUrl: segment.channel!.profilePhotoUrl,
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                streamStartDate: segment.streamStartDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: chunkIsShorterThanMinimum(segment),
                server: segment.server ? {
                    id: segment.server.id,
                    key: segment.server.key ?? undefined,
                    name: segment.server.name,
                    tagName: segment.server.tagName,
                    isVisible: segment.server.isVisible,
                    isRoleplay: segment.server.isRoleplay,
                } : undefined,
                game: {
                    id: segment.game!.id,
                    key: segment.game!.key ?? undefined,
                    name: segment.game!.name,
                },
            },
        };
    };

    const streams = segments
        .filter(s => s.channel && s.game)
        .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
        .map(segmentAndStreamer);

    const nextCursor = rawSegments.length
        ? serializeRecentStreamsCursor({ before: new Date(rawSegments[rawSegments.length - 1].lastSeenDate) })
        : undefined;

    return { streams, nextCursor, lastRefreshTime };
};

export const parseStreamsQuery = (query: Request['query'] | URLSearchParams): StreamsParams | { error: string } => {
    const params: StreamsParams = {};
    try {
        params.live = queryParamBoolean(query, 'live');
        params.distinctCharacters = queryParamBoolean(query, 'distinctCharacters');
        params.factionKey = queryParamString(query, 'factionKey');
        params.channelTwitchId = queryParamString(query, 'channelTwitchId');
        params.search = queryParamString(query, 'search');
        params.startBefore = queryParamDate(query, 'startBefore');
        params.startAfter = queryParamDate(query, 'startAfter');
        params.endBefore = queryParamDate(query, 'endBefore');
        params.endAfter = queryParamDate(query, 'endAfter');
        params.serverKey = queryParamString(query, 'serverKey');
        params.serverId = queryParamInteger(query, 'serverId');
        params.gameKey = queryParamString(query, 'gameKey');
        params.tempAllowNoServer = queryParamBoolean(query, 'tempAllowNoServer');
        const cursorString = queryParamString(query, 'cursor');
        const cursor = cursorString
            ? deserializeRecentStreamsCursor(cursorString)
            : undefined;
        if (cursor === null) {
            return { error: `"${cursorString}" is an invalid cursor` };
        }
        params.cursor = cursor;

        const limit = queryParamInteger(query, 'limit');
        params.limit = limit && limit > 100 ? 100 : limit;
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
        const params = parseStreamsQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchStreams(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    router.get('/live', async (req, res) => {
        const params = parseStreamsQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchLiveStreams(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    router.get('/recent', async (req, res) => {
        const params = parseStreamsQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchRecentStreams(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    router.get('/unknown', async (req, res) => {
        const params = parseStreamsQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchUnknownStreams(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
