import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource, In } from 'typeorm';
import { StreamsResponse, SegmentAndStreamer, UserResponse } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { fetchCharacters } from './characters';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { Video } from '../../db/entity/Video';
import { videoUrlOffset } from '../../utils';
import { isEditorForTwitchId, isGlobalEditor } from '../../userUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { minimumSegmentLengthMinutes, chunkIsShorterThanMinimum } from '../../segmentUtils';

export const fetchLiveStreams = async (apiClient: ApiClient, dataSource: DataSource, userResponse: UserResponse): Promise<StreamsResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveDataSegmentIdLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));
    const liveDataTwitchUserIdLookup = Object.fromEntries(liveData.streams
        .map(s => [s.channelName.toLowerCase(), s]));

    const characters = await fetchCharacters(apiClient, dataSource, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );
    const segments = liveSegmentIds.length > 0
        ? await dataSource.getRepository(StreamChunk)
            .find({
                where: {
                    id: In(liveSegmentIds),
                },
                order: {
                    lastViewerCount: 'desc',
                    channel: { twitchLogin: 'desc' },
                },
                relations: {
                    video: true,
                    channel: true,
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
                liveInfo: liveDataTwitchUserIdLookup[segment.channel!.displayName.toLowerCase()],
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: liveDataSegmentIdLookup[segment.id]?.thumbnailUrl ?? segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataSegmentIdLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: false, // Live streams are never excluded for length
            },
        };
    };

    return {
        streams: segments
            .filter(s => s.channel)
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
    startBefore?: Date;
    startAfter?: Date;
    endBefore?: Date;
    endAfter?: Date;
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
        startBefore,
        startAfter,
        endBefore,
        endAfter,
        cursor,
        limit = DEFAULT_LIMIT,
    } = params;

    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveCharacterIds = liveData.streams.flatMap(s => (s.characterId ? [s.characterId] : []));
    const liveDataTwitchUserIdLookup = Object.fromEntries(liveData.streams
        .map(s => [s.channelName.toLowerCase(), s]));

    const characters = await fetchCharacters(apiClient, dataSource, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

    const queryBuilder = dataSource
        .createQueryBuilder()
        .select('*')
        .from((qb) => {
            const subQuery = qb
                .subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.id', 'id')
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
                .orderBy('stream_chunk.characterId', 'ASC')
                .addOrderBy('stream_chunk.lastSeenDate', 'DESC');

            if (distinctCharacters) {
                subQuery.distinctOn(['stream_chunk.characterId']);
                if (liveCharacterIds.length) {
                    subQuery.andWhere('stream_chunk.characterId NOT IN (:...liveCharacterIds)', { liveCharacterIds });
                }
            } else if (liveSegmentIds.length) {
                subQuery.andWhere('stream_chunk.id NOT IN (:...liveSegmentIds)', { liveSegmentIds });
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

    const rawToReal = (raw: Raw<StreamChunk>): StreamChunk => {
        const { streamStartDate, firstSeenDate, lastSeenDate, ...rest } = raw;
        return {
            channel: channelLookup[rest.streamerId],
            video: videoLookup[rest.streamId],
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
                liveInfo: liveDataTwitchUserIdLookup[segment.channel!.displayName.toLowerCase()],
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: chunkIsShorterThanMinimum(segment),
            },
        };
    };

    const streams = segments
        .filter(s => s.channel)
        .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
        .map(segmentAndStreamer);

    const nextCursor = rawSegments.length
        ? serializeRecentStreamsCursor({ before: new Date(rawSegments[rawSegments.length - 1].lastSeenDate) })
        : undefined;

    const lastRefreshTime = new Date(liveData.tick).toISOString();

    return { streams, nextCursor, lastRefreshTime };
};

export const fetchStreams = async (apiClient: ApiClient, dataSource: DataSource, params: StreamsParams = {}, userResponse: UserResponse): Promise<StreamsResponse> => {
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

    const { streams: liveStreams, lastRefreshTime } = await fetchLiveStreams(apiClient, dataSource, userResponse);

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
    cursor: RecentStreamsCursor | undefined,
    userResponse: UserResponse
): Promise<StreamsResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveDataLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));

    const characters = await fetchCharacters(apiClient, dataSource, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

    const queryBuilder = dataSource
        .createQueryBuilder()
        .select('*')
        .from((qb) => {
            const subQuery = qb
                .subQuery()
                .from(StreamChunk, 'stream_chunk')
                .select('stream_chunk.id', 'id')
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
                .where('(stream_chunk.characterId IS NULL OR (stream_chunk.characterId IS NOT NULL AND stream_chunk.characterUncertain = true))')
                .orderBy('stream_chunk.lastSeenDate', 'DESC');
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
        .limit(DEFAULT_LIMIT);

    if (cursor) {
        queryBuilder
            .andWhere('"lastSeenDate" < :before::timestamp without time zone', { before: cursor.before });
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

    const rawToReal = (raw: Raw<StreamChunk>): StreamChunk => {
        const { streamStartDate, firstSeenDate, lastSeenDate, ...rest } = raw;
        return {
            channel: channelLookup[rest.streamerId],
            video: videoLookup[rest.streamId],
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
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: chunkIsShorterThanMinimum(segment),
            },
        };
    };

    const streams = segments
        .filter(s => s.channel)
        .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
        .map(segmentAndStreamer);

    const nextCursor = rawSegments.length
        ? serializeRecentStreamsCursor({ before: new Date(rawSegments[rawSegments.length - 1].lastSeenDate) })
        : undefined;

    const lastRefreshTime = new Date(liveData.tick).toISOString();

    return { streams, nextCursor, lastRefreshTime };
};

class ParamError extends Error {
    constructor(public message: string) {
        super();
    }
}

const queryParamString = (query: Request['query'] | URLSearchParams, name: string): undefined | string => {
    const param = query instanceof URLSearchParams
        ? query.get(name)
        : query[name];
    if (param === undefined || param === null) {
        return undefined;
    }
    if (typeof param !== 'string') {
        throw new ParamError(`'${name}' parameter must be a string`);
    }
    return param;
};

const queryParamDate = (query: Request['query'] | URLSearchParams, name: string): undefined | Date => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    const date = new Date(stringParam);
    if (Number.isNaN(date.getTime())) {
        throw new ParamError(`'${stringParam}' is not a valid date for '${name}'. Must use ISO 8601 format.`);
    }
    return date;
};

const queryParamBoolean = (query: Request['query'] | URLSearchParams, name: string): undefined | boolean => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    if (stringParam === 'true') {
        return true;
    }
    if (stringParam === 'false') {
        return false;
    }
    throw new ParamError(`'${stringParam}' is not a valid boolean for '${name}'. Must be "true" or "false".`);
};

const queryParamInteger = (query: Request['query'] | URLSearchParams, name: string): undefined | number => {
    const stringParam = queryParamString(query, name);
    if (stringParam === undefined) {
        return undefined;
    }
    const num = Number(stringParam);
    if (!Number.isInteger(num) || String(num) !== stringParam) {
        throw new ParamError(`'${stringParam}' is not a valid valie for '${name}'.`);
    }
    return num;
};

export const parseStreamsQuery = (query: Request['query'] | URLSearchParams): StreamsParams | { error: string } => {
    const params: StreamsParams = {};
    try {
        params.live = queryParamBoolean(query, 'live');
        params.distinctCharacters = queryParamBoolean(query, 'distinctCharacters');
        params.startBefore = queryParamDate(query, 'startBefore');
        params.startAfter = queryParamDate(query, 'startAfter');
        params.endBefore = queryParamDate(query, 'endBefore');
        params.endAfter = queryParamDate(query, 'endAfter');
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
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchLiveStreams(apiClient, dataSource, userResponse);
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
        const { cursor: cursorString } = req.query;
        if (cursorString !== undefined && typeof cursorString !== 'string') {
            return res.status(400).send({ success: false, message: '`cursor` parameter must be a string' });
        }
        const cursor = cursorString
            ? deserializeRecentStreamsCursor(cursorString)
            : undefined;
        if (cursor === null) {
            return res.status(400).send({ success: false, message: `"${cursorString}" is an invalid cursor` });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchUnknownStreams(apiClient, dataSource, cursor, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
