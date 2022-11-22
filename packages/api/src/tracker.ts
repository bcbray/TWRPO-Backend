import { ApiClient, HelixStream, HelixGame } from '@twurple/api';
import { DataSource, Not, In } from 'typeorm';

import { TwitchChannel } from './db/entity/TwitchChannel';
import { StreamChunk } from './db/entity/StreamChunk';
import { Game } from './db/entity/Game';
import { wrpCharacters } from './data/characters';

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

const fetchStreams = async (apiClient: ApiClient, channels: TwitchChannel[]): Promise<HelixStream[] | null> => {
    const toSearch = [...channels];
    const allStreams: HelixStream[] = [];
    try {
        while (toSearch.length > 0) {
            const thisSearch = toSearch.splice(0, fetchLimit);
            console.log(JSON.stringify({
                level: 'info',
                message: `Fetching user streams for ${thisSearch.length} users`,
                event: 'user-streams-fetch',
                count: thisSearch.length,
            }));
            const foundStreams = await apiClient.streams.getStreamsByUserIds(thisSearch.map(u => u.twitchId));
            console.log(JSON.stringify({
                level: 'info',
                message: `Found ${foundStreams.length} user streams`,
                event: 'user-streams-fetch-found',
                count: foundStreams.length,
            }));
            allStreams.push(...foundStreams);
        }
        console.log(JSON.stringify({
            level: 'info',
            message: `Found ${allStreams.length} total user streams`,
            event: 'user-streams-fetch-total',
            count: allStreams.length,
        }));
        return allStreams;
    } catch (err) {
        console.log(JSON.stringify({
            level: 'warning',
            message: 'Failed to fetch streams for users',
            event: 'twitch-user-streams-fetch-failed',
            fetchedCount: allStreams.length,
            toFetchCount: toSearch.length,
            error: err,
        }));
        return null;
    }
};

const fetchGames = async (apiClient: ApiClient, gameIds: string[]): Promise<HelixGame[] | null> => {
    const toSearch = [...gameIds];
    const allGames: HelixGame[] = [];
    try {
        while (toSearch.length > 0) {
            const thisSearch = toSearch.splice(0, fetchLimit);
            console.log(JSON.stringify({
                level: 'info',
                message: `Fetching ${thisSearch.length} games`,
                event: 'games-fetch',
                count: thisSearch.length,
            }));
            const foundGames = await apiClient.games.getGamesByIds(gameIds);
            console.log(JSON.stringify({
                level: 'info',
                message: `Found ${foundGames.length} games`,
                event: 'games-found',
                count: foundGames.length,
            }));
            allGames.push(...foundGames);
        }
        console.log(JSON.stringify({
            level: 'info',
            message: `Found ${allGames.length} total games`,
            event: 'games-fetch-total',
            count: allGames.length,
        }));
        return allGames;
    } catch (err) {
        console.log(JSON.stringify({
            level: 'warning',
            message: 'Failed to fetch streams for users',
            event: 'games-fetch-failed',
            fetchedCount: allGames.length,
            toFetchCount: toSearch.length,
            error: err,
        }));
        return null;
    }
};

export interface MiniSegment {
    channelTwitchId: string;
    segmentId?: number;
}

export const track = async (apiClient: ApiClient, dataSource: DataSource, alreadyFetchedSegments: MiniSegment[]): Promise<void> => {
    const ignoredChannelTwitchIds = alreadyFetchedSegments.map(s => s.channelTwitchId);
    const trackedChannels = await dataSource
        .getRepository(TwitchChannel)
        .findBy({
            id: ignoredChannelTwitchIds.length > 0 ? Not(In(ignoredChannelTwitchIds)) : undefined,
            isTracked: true,
        });

    const now = new Date();

    const streams = await fetchStreams(apiClient, trackedChannels);
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
                console.error(JSON.stringify({
                    level: 'error',
                    message: 'Failed to update chunk',
                    chunkUpdate,
                    error,
                }));
                continue;
            }
        } else {
            try {
                const newChunk = await dataSource
                    .getRepository(StreamChunk)
                    .save(chunk);
                newChunks.push(newChunk);
            } catch (error) {
                console.error(JSON.stringify({
                    level: 'error',
                    message: 'Failed to insert chunk',
                    chunk,
                    error,
                }));
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

    console.log(JSON.stringify({
        level: 'info',
        event: 'user-segment-update',
        message: `Updated ${updatedChunks.length} user streams in database`,
        count: updatedChunks.length,
    }));

    console.log(JSON.stringify({
        level: 'info',
        event: 'user-segment-insert',
        message: `Stored ${newChunks.length} new user streams to database`,
        count: newChunks.length,
    }));

    console.log(JSON.stringify({
        level: 'info',
        event: 'user-segment-update-not-live',
        message: `Updated ${noLongerLiveResult.affected ?? 0} user streams to no longer be live`,
        count: noLongerLiveResult.affected ?? 0,
    }));

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
    const newGames = await fetchGames(apiClient, newGameIds);

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
        console.log(JSON.stringify({
            level: 'info',
            event: 'game-insert',
            message: `Stored ${gamesToInsert.length} new games to database`,
            count: gamesToInsert.length,
        }));
    } catch (error) {
        console.error(JSON.stringify({
            level: 'error',
            message: 'Failed to insert chunk',
            games: gamesToInsert,
            error,
        }));
    }
};
