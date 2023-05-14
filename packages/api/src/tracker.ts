import { ApiClient, HelixStream, HelixGame } from '@twurple/api';
import { DataSource, Not, In } from 'typeorm';

import { TwitchChannel } from './db/entity/TwitchChannel';
import { StreamChunk } from './db/entity/StreamChunk';
import { StreamChunkStat } from './db/entity/StreamChunkStat';
import { Game } from './db/entity/Game';
import { wrpCharacters } from './data/characters';
import type { Logger } from './logger';

const fetchLimit = 100 as const;

export const syncTracked = async (dataSource: DataSource): Promise<void> => {
    const channelNames = Object.entries(wrpCharacters).reduce((names, [streamer, characters]) => (
        characters.some(c => c.assume === 'neverNp') ? names : [...names, streamer.toLowerCase()]
    ), [] as string[]);
    await dataSource
        .createQueryBuilder()
        .update(TwitchChannel)
        .set({ isTracked: true })
        .where('LOWER(displayName) IN (:...channelNames)', { channelNames })
        .execute();
};

const fetchStreams = async (apiClient: ApiClient, logger: Logger, channels: TwitchChannel[]): Promise<HelixStream[] | null> => {
    const toSearch = [...channels];
    const allStreams: HelixStream[] = [];
    try {
        while (toSearch.length > 0) {
            const thisSearch = toSearch.splice(0, fetchLimit);
            logger.info(`Fetching user streams for ${thisSearch.length} users`, {
                event: 'user-streams-fetch',
                count: thisSearch.length,
            });
            const foundStreams = await apiClient.streams.getStreamsByUserIds(thisSearch.map(u => u.twitchId));
            logger.info(`Found ${foundStreams.length} user streams`, {
                event: 'user-streams-fetch-found',
                count: foundStreams.length,
            });
            allStreams.push(...foundStreams);
        }
        logger.info(`Found ${allStreams.length} total user streams`, {
            event: 'user-streams-fetch-total',
            count: allStreams.length,
        });
        return allStreams;
    } catch (err) {
        logger.warning('Failed to fetch streams for users', {
            event: 'twitch-user-streams-fetch-failed',
            fetchedCount: allStreams.length,
            toFetchCount: toSearch.length,
            error: err,
        });
        return null;
    }
};

const fetchGames = async (apiClient: ApiClient, logger: Logger, gameIds: string[]): Promise<HelixGame[] | null> => {
    const toSearch = [...gameIds];
    const allGames: HelixGame[] = [];
    try {
        while (toSearch.length > 0) {
            const thisSearch = toSearch.splice(0, fetchLimit);
            logger.info(`Fetching ${thisSearch.length} games`, {
                event: 'games-fetch',
                count: thisSearch.length,
            });
            const foundGames = await apiClient.games.getGamesByIds(gameIds);
            logger.info(`Found ${foundGames.length} games`, {
                event: 'games-found',
                count: foundGames.length,
            });
            allGames.push(...foundGames);
        }
        logger.info(`Found ${allGames.length} total games`, {
            event: 'games-fetch-total',
            count: allGames.length,
        });
        return allGames;
    } catch (err) {
        logger.warning('Failed to fetch streams for users', {
            event: 'games-fetch-failed',
            fetchedCount: allGames.length,
            toFetchCount: toSearch.length,
            error: err,
        });
        return null;
    }
};

export interface MiniSegment {
    channelTwitchId: string;
    segmentId?: number;
}

export interface TrackOptions {
    alreadyFetchedSegments?: MiniSegment[];
    now?: Date;
}

export const track = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger, options: TrackOptions): Promise<void> => {
    const {
        alreadyFetchedSegments = [],
        now = new Date(),
    } = options;
    const ignoredChannelTwitchIds = alreadyFetchedSegments.map(s => s.channelTwitchId);
    const trackedChannels = await dataSource
        .getRepository(TwitchChannel)
        .findBy({
            twitchId: ignoredChannelTwitchIds.length > 0 ? Not(In(ignoredChannelTwitchIds)) : undefined,
            isTracked: true,
        });

    const streams = await fetchStreams(apiClient, logger, trackedChannels);
    if (streams === null) {
        return;
    }

    const newChunks: StreamChunk[] = [];
    const updatedChunks: StreamChunk[] = [];

    for (const stream of streams) {
        const mostRecentStreamSegment = await dataSource
            .getRepository(StreamChunk)
            .findOne({
                where: {
                    streamerId: stream.userId,
                    streamId: stream.id,
                },
                order: {
                    lastSeenDate: 'desc',
                },
            });

        const chunk: Omit<StreamChunk, 'id' | 'isOverridden' | 'isHidden' | 'characterId' | 'characterUncertain' | 'serverId' | 'serverUncertain'> = {
            streamerId: stream.userId,
            streamId: stream.id,
            streamStartDate: stream.startDate,
            title: stream.title,
            firstSeenDate: now,
            lastSeenDate: now,
            lastViewerCount: stream.viewers,
            gameTwitchId: stream.gameId,
            isLive: true,
        };

        // This is done here not as a WHERE clause so that we always
        // compare against the most-recent segment, not just the
        // most-recent segment with a matching title
        if (mostRecentStreamSegment && mostRecentStreamSegment.gameTwitchId === stream.gameId && mostRecentStreamSegment.title === stream.title) {
            const { id } = mostRecentStreamSegment;
            const { lastSeenDate, lastViewerCount, isLive } = chunk;
            const chunkUpdate: Pick<StreamChunk, 'id' | 'lastSeenDate' | 'lastViewerCount' | 'isLive'> = {
                id,
                lastSeenDate,
                lastViewerCount,
                isLive,
            };

            try {
                const appliedUpdate = { ...chunkUpdate };
                await dataSource
                    .getRepository(StreamChunk)
                    .save(chunkUpdate);

                updatedChunks.push({
                    ...mostRecentStreamSegment,
                    ...appliedUpdate,
                });
            } catch (error) {
                logger.error('Failed to update chunk', {
                    chunkUpdate,
                    error,
                });
                continue;
            }
        } else {
            try {
                const newChunk = await dataSource
                    .getRepository(StreamChunk)
                    .save(chunk);
                newChunks.push(newChunk);
            } catch (error) {
                logger.error('Failed to insert chunk', {
                    chunk,
                    error,
                });
            }
        }
    }

    const allChunks = [...newChunks, ...updatedChunks];
    const alreadyLiveSegementIds = alreadyFetchedSegments.reduce((ids, segment) => (
        segment.segmentId ? [...ids, segment.segmentId] : ids
    ), [] as number[]);
    const newlyLiveSegmentIds = allChunks.map(c => c.id);

    const allLiveSegmentIds = [...alreadyLiveSegementIds, ...newlyLiveSegmentIds];

    const noLongerLiveResult = await dataSource
        .getRepository(StreamChunk)
        .update(
            {
                isLive: true,
                id: allLiveSegmentIds.length > 0 ? Not(In(allLiveSegmentIds)) : undefined,
            },
            { isLive: false }
        );

    if (!process.env.DISABLE_VIEWER_STATS) {
        const insertedStats = await dataSource
            .getRepository(StreamChunkStat)
            .insert(allChunks.map(c => ({
                streamChunkId: c.id,
                time: now,
                viewerCount: c.lastViewerCount,
            })));

        logger.info(`Stored ${insertedStats.identifiers.length} user stream chunk stats to database`, {
            event: 'user-segment-stat-insert',
            count: insertedStats.identifiers.length,
        });
    }

    logger.info(`Updated ${updatedChunks.length} user streams in database`, {
        event: 'user-segment-update',
        count: updatedChunks.length,
    });

    logger.info(`Stored ${newChunks.length} new user streams to database`, {
        event: 'user-segment-insert',
        count: newChunks.length,
    });

    logger.info(`Updated ${noLongerLiveResult.affected ?? 0} user streams to no longer be live`, {
        event: 'user-segment-update-not-live',
        count: noLongerLiveResult.affected ?? 0,
    });

    const gameIds = [...new Set(streams.map(s => s.gameId))];
    if (gameIds.length === 0) {
        return;
    }

    const knownGames = await dataSource
        .getRepository(Game)
        .findBy({ twitchId: In(gameIds) });
    const knownGameIds = new Set(knownGames.map(g => g.twitchId));

    const newGameIds = gameIds.filter(id => !knownGameIds.has(id));

    if (newGameIds.length === 0) {
        return;
    }
    const newGames = await fetchGames(apiClient, logger, newGameIds);

    if (newGames === null || newGames.length === 0) {
        return;
    }

    const gamesToInsert: Omit<Game, 'id' | 'key'>[] = newGames.map(game => ({
        twitchId: game.id,
        name: game.name,
        boxArtUrl: game.boxArtUrl,
    }));
    try {
        await dataSource.getRepository(Game).insert(gamesToInsert);
        logger.info(`Stored ${gamesToInsert.length} new games to database`, {
            event: 'game-insert',
            count: gamesToInsert.length,
        });
    } catch (error) {
        logger.error('Failed to insert chunk', {
            games: gamesToInsert,
            error,
        });
    }
};
