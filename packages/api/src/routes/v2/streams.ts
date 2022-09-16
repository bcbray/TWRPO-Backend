import { Router } from 'express';
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

export const fetchLiveStreams = async (apiClient: ApiClient, dataSource: DataSource, userResponse: UserResponse): Promise<StreamsResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveSegmentIds = liveData.streams.flatMap(s => (s.segmentId ? [s.segmentId] : []));
    const liveDataLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));

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
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: liveDataLookup[segment.id]?.thumbnailUrl ?? segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
            },
        };
    };

    return {
        streams: segments
            .filter(s => s.channel)
            .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
            .map(segmentAndStreamer),
    };
};

export interface RecentStreamsCursor {
    before: Date;
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

export const fetchRecentStreams = async (apiClient: ApiClient, dataSource: DataSource, cursor: RecentStreamsCursor | undefined, userResponse: UserResponse): Promise<StreamsResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, userResponse);
    const liveCharacterIds = liveData.streams.flatMap(s => (s.characterId ? [s.characterId] : []));

    const characters = await fetchCharacters(apiClient, dataSource, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

    const limit = 24;
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
                .distinctOn(['stream_chunk.characterId'])
                .where('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
                .orderBy('stream_chunk.characterId', 'ASC');
            if (cursor) {
                subQuery.andWhere('stream_chunk.lastSeenDate < :before', { before: cursor.before });
            }
            if (liveCharacterIds.length) {
                subQuery.andWhere('stream_chunk.characterId NOT IN (:...liveCharacterIds)', { liveCharacterIds });
            }
            if (!isGlobalEditor(userResponse)) {
                subQuery.andWhere('stream_chunk.isHidden = false');
            }
            return subQuery;
        }, 'recent_chunk')
        .orderBy('"lastSeenDate"', 'DESC')
        .limit(limit + 1);

    if (cursor) {
        queryBuilder
            .andWhere('"lastSeenDate" < :before::timestamp without time zone', { before: cursor.before });
    }

    const rawSegments: Raw<StreamChunk>[] = await queryBuilder.execute();

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
                streamId: segment.streamId,
                isHidden: segment.isHidden,
            },
        };
    };

    const allStreams = segments
        .filter(s => s.channel)
        .filter(s => !s.isHidden || isEditorForTwitchId(s.streamerId, userResponse))
        .map(segmentAndStreamer);
    const streams = allStreams.slice(0, limit);

    const nextCursor = allStreams.length > streams.length
        ? serializeRecentStreamsCursor({ before: segments[segments.length - 1].lastSeenDate })
        : undefined;

    return { streams, nextCursor };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/live', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchLiveStreams(apiClient, dataSource, userResponse);
        return res.send(response);
    });

    router.get('/recent', async (req, res) => {
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
        const response = await fetchRecentStreams(apiClient, dataSource, cursor, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
