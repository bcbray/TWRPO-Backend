import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { startOfDay, differenceInSeconds, secondsInDay } from 'date-fns';
import { StreamersResponse, StreamerResponse, UserResponse } from '@twrpo/types';

import { wrpCharacters, requestedRemovedCharacters } from '../../data/characters';
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
import { Logger } from '../../logger';

const charactersLookup = Object.fromEntries(
    Object.entries(wrpCharacters).map(([s, c]) => [s.toLowerCase(), c])
);

interface Interval<T> {
    start: T;
    end: T;
}

/** Normalized interval from 0-1 */
type NormalizedInterval = Interval<number>;

/** Normalized interval with the count of overlapping intervals */
interface NormalizedSumInterval extends NormalizedInterval {
    count: number;
}

/** One edge of an Interval */
interface Edge {
    point: number;
    type: 'start' | 'end';
}

/**
    Turns an Interval into a NormalizedInterval using the given range
*/
function normalizeInterval<T>(
    interval: Interval<T>,
    range: Interval<T>,
    number: (value: T) => number
): NormalizedInterval {
    const min = number(range.start);
    const max = number(range.end);
    const length = max - min;
    const start = number(interval.start);
    const end = number(interval.end);
    return {
        start: (start - min) / length,
        end: (end - min) / length,
    };
}

/**
    Splits a normalized interval that falls outside of [0,1] by rotating values
    around the normalized interval.

    e.g.
    [0.2, 1.4] turns in to [[0.2, 1], [0, 0.4]]
    [-0.45, 0.6] turns in to [[0.55, 1], [0, 0.6]]
    [0.8, 3.6] turns in to [[0.8, 1], [0,1], [0,1], [0, 0.6]]
*/
function splitIntervalIfNecessary(interval: NormalizedInterval): NormalizedInterval[] {
    // TODO: probably handle start > 1 or end < 0
    let { start, end } = interval;
    const intervals: NormalizedInterval[] = [
        { start: Math.max(0, start), end: Math.min(1, end) },
    ];
    while (start < 0) {
        start += 1;
        intervals.push({ start: Math.max(0, start), end: 1 });
    }
    while (end > 1) {
        end -= 1;
        intervals.push({ start: 0, end: Math.min(1, end) });
    }
    return intervals;
}

/**
    The start and end edges of the interval
*/
function edges(interval: NormalizedInterval): Edge[] {
    return [
        { point: interval.start, type: 'start' },
        { point: interval.end, type: 'end' },
    ];
}

/**
    The counts of intervals for all subdivisions of [0,1].

    e.g. given a set of intervals like:
        ```
            [0.10, 0.30]: --••••--------------
            [0.00, 0.20]: ••••----------------
            [0.45, 0.75]: ---------••••••-----
            [0.10, 0.35]: --•••••-------------
            [0.85, 0.95]: -----------------••-
        ```
        returns intervals like:
        ```
                          11332210011111100110
        ```
        that is:
        ```
            [0.00, 0.10]: 1
            [0.10, 0.20]: 3
            [0.20, 0.30]: 2
            [0.39, 0.35]: 1
            [0.35, 0.45]: 0
            [0.45, 0.75]: 1
            [0.75, 0.95]: 0
            [0.95, 1.00]: 0
        ```
*/
function sum(intervals: NormalizedInterval[]): NormalizedSumInterval[] {
    const sortedEdges = intervals
        .flatMap(splitIntervalIfNecessary)
        .flatMap(edges)
        .sort((lhs, rhs) => lhs.point - rhs.point);
    const edgesToConsider: Edge[] = [...sortedEdges, { point: 1, type: 'end' }];
    const intervalsintervals: NormalizedSumInterval[] = [];
    let currentSum = 0;
    let currentPoint = 0;
    for (const { point, type } of edgesToConsider) {
        if (point !== currentPoint) {
            intervalsintervals.push({
                start: currentPoint,
                end: point,
                count: currentSum,
            });
            currentPoint = point;
        }
        if (type === 'start') {
            currentSum += 1;
        } else if (type === 'end') {
            currentSum -= 1;
        }
    }
    return intervalsintervals;
}

/**
    Find the longest interval with the lowest count.

    Note: may return an interval outside of [0,1] if the best interval wraps
    around the normalized range.
*/
function bestInterval(intervals: NormalizedSumInterval[]): NormalizedSumInterval | undefined {
    // First, move and concatenate the end interval to the start if they're equal count
    const rotatedIntervals = [...intervals];
    if (rotatedIntervals.length > 1) {
        const first = rotatedIntervals[0];
        const last = rotatedIntervals[intervals.length - 1];
        if (first.count === last.count && first.start === 0 && last.end === 1) {
            const { end, count } = first;
            const { start } = last;
            rotatedIntervals.shift();
            rotatedIntervals.pop();
            rotatedIntervals.unshift({
                start: start - 1,
                end,
                count,
            });
        }
    }

    let best: NormalizedSumInterval | undefined;
    for (const interval of rotatedIntervals) {
        if (best === undefined) {
            best = interval;
        } else if (interval.count < best.count
            || (interval.count === best.count
                && (interval.end - interval.start) > (best.end - best.start))) {
            best = interval;
        }
    }
    return best;
}

const bestStartTimeOffset = (chunks: StreamChunk[]): number | undefined => {
    const range = { start: 0, end: secondsInDay };
    const intervals = chunks
        .map((chunk) => {
            const start = startOfDay(chunk.firstSeenDate);
            const startOffset = differenceInSeconds(chunk.firstSeenDate, start);
            const endOffset = differenceInSeconds(chunk.lastSeenDate, start);
            return {
                start: startOffset,
                end: endOffset,
            };
        })
        .map(i => normalizeInterval(i, range, v => v));
    const summedIntervals = sum(intervals);
    const best = bestInterval(summedIntervals);
    if (!best) {
        return undefined;
    }
    const normalizedEnd = best.end - Math.floor(best.end);
    return Math.round(normalizedEnd * secondsInDay);
};

export const fetchStreamers = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    currentUser: UserResponse
): Promise<StreamersResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, logger, currentUser);

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

export const fetchStreamer = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    login: string,
    currentUser: UserResponse
): Promise<StreamerResponse | null> => {
    const channel = await dataSource
        .getRepository(TwitchChannel)
        .findOne({ where: { twitchLogin: login.toLowerCase() } });

    if (!channel) {
        return null;
    }

    const entry = Object.entries(wrpCharacters)
        .find(([streamer]) => streamer.toLowerCase() === channel.twitchLogin.toLowerCase());

    const requestedRemoval = requestedRemovedCharacters
        .some(streamer => streamer.toLowerCase() == channel.twitchLogin.toLowerCase());

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
                game: { key: 'rdr2' },
            },
            relations: {
                video: true,
                server: true,
                game: true,
            },
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
        .filter(chunk => chunk.game && (includeHiddenSegments || !chunk.isTooShort));

    if (rawCharacters.length === 0 && validSegments.length === 0) {
        // If we have neither characters nor videos, ignore this streamer
        return null;
    }

    const liveData = await getFilteredWrpLive(apiClient, dataSource, logger, currentUser);

    const liveInfo = liveData.streams.find(s =>
        s.channelName === channel.displayName);

    // TODO: Build a way to fetch all factions for the servers this streamer has characters on
    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource, logger, { serverKey: 'wrp' }, currentUser);
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

    const allChunksQueryBuilder = dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .leftJoinAndSelect('stream_chunk.video', 'video')
        .leftJoinAndSelect('stream_chunk.server', 'server')
        .innerJoinAndSelect('stream_chunk.game', 'game')
        .where('stream_chunk.streamerId = :streamerId', { streamerId: channel.twitchId });

    if (!includeHiddenSegments) {
        allChunksQueryBuilder
            .andWhere('stream_chunk.lastSeenDate - stream_chunk.firstSeenDate > make_interval(mins => 10)')
            .andWhere('stream_chunk.isHidden = false');
    }

    const allChunks = await allChunksQueryBuilder.getMany();
    const averageStreamStartTimeOffset = bestStartTimeOffset(allChunks);

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
        requestedRemoval,
        characters: characterInfos,
        recentSegments: validSegments
            .map((segment, idx) => [segment, idx] as [StreamChunk & { isTooShort: boolean }, number])
            .filter(([segment]) => segment.game)
            .map(([segment, idx]) => {
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
                    server: segment.server ? {
                        id: segment.server.id,
                        key: segment.server.key ?? undefined,
                        name: segment.server.name,
                        tagName: segment.server.tagName,
                        isVisible: segment.server.isVisible,
                        isRoleplay: segment.server.isRoleplay,
                    } : undefined,
                    serverUncertain: segment.serverUncertain,
                    game: {
                        id: segment.game!.id,
                        key: segment.game!.key ?? undefined,
                        name: segment.game!.name,
                    },
                };
            }),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchStreamers(apiClient, dataSource, logger, userResponse);
        return res.send(response);
    });

    router.get('/:login', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const { login } = req.params;
        const response = await fetchStreamer(apiClient, dataSource, logger, login, userResponse);
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
