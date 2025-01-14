import { ApiClient, HelixForwardPagination } from '@twurple/api';
import { HttpStatusCodeError } from '@twurple/api-call';
import { DataSource } from 'typeorm';

import { StreamChunk } from './db/entity/StreamChunk';
import { TwitchChannel } from './db/entity/TwitchChannel';
import { Video } from './db/entity/Video';
import { Logger } from './logger';

export const fetchVideosForUser = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    userId: string,
    knownStreamIds: Set<string>
): Promise<number> => {
    let foundVideos = 0;
    let pages = 10;
    let after: HelixForwardPagination['after'];
    try {
        while (pages > 0) {
            logger.info(`Fetching videos page “${11 - pages}” for ${userId}`, {
                event: 'video-fetch',
                userId,
            });
            const videos = await apiClient.videos.getVideosByUser(userId, {
                type: 'archive',
                after,
                limit: 100,
            });
            for (const video of videos.data) {
                if (video.streamId && knownStreamIds.has(video.streamId)) {
                    await dataSource.getRepository(Video).insert({
                        videoId: video.id,
                        streamId: video.streamId,
                        streamerId: video.userId,
                        streamCreatedDate: video.creationDate,
                        streamPublishedDate: video.publishDate,
                        url: video.url,
                        thumbnailUrl: video.thumbnailUrl.length && !video.thumbnailUrl.includes('_404/404_processing_')
                            ? video.thumbnailUrl
                            : undefined,
                        title: video.title,
                        duration: video.duration,
                    });
                    logger.info(`Found video “${video.title}” for ${video.userDisplayName}`, {
                        event: 'video-found',
                        channel: video.userDisplayName,
                        streamTitle: video.title,
                    });
                    foundVideos += 1;
                }
            }
            if (!videos.cursor) {
                break;
            }
            after = videos.cursor;
            pages -= 1;
        }
    } catch (error) {
        logger.warning(`Failed to fetch page “${11 - pages}” for ${userId}`, {
            event: 'twitch-video-fetch-failed',
            error,
        });
    }
    return foundVideos;
};

export const fetchMissingThumbnailsForVideoIds = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger,
    videoIds: string[]
): Promise<void> => {
    const fetchLimit = 100;
    const toFetchVideoIds = [...videoIds];

    logger.info(`Fetching thumbnails for ${videoIds.length} videos`, {
        event: 'video-thumbnail-start',
        videoCount: toFetchVideoIds.length,
    });

    const fetchStart = process.hrtime.bigint();
    let foundThumbnails = 0;

    try {
        while (toFetchVideoIds.length > 0) {
            const thisSearch = toFetchVideoIds.splice(0, fetchLimit);
            try {
                const videos = await apiClient.videos.getVideosByIds(thisSearch);
                for (const video of videos) {
                    if (video.thumbnailUrl && !video.thumbnailUrl.includes('_404/404_processing_')) {
                        await dataSource.getRepository(Video)
                            .update(
                                { videoId: video.id },
                                { thumbnailUrl: video.thumbnailUrl }
                            );
                        logger.info(`Found thumbnail for “${video.title}” for ${video.userDisplayName}`, {
                            event: 'video-thumbnail-found',
                            channel: video.userDisplayName,
                            streamTitle: video.title,
                        });
                        foundThumbnails += 1;
                    }
                }
            } catch (error) {
                // Ignore 404s (which will happen if we have a page full of deleted videos)
                if (error instanceof HttpStatusCodeError && error.statusCode === 404) {
                    logger.info(`No videos found for ids (${thisSearch.join(', ')})`, {
                        event: 'video-thumbnail-not-found',
                        ids: thisSearch,
                    });
                    continue;
                }
                throw error;
            }
        }

        const fetchEnd = process.hrtime.bigint();

        logger.info(`Fetched thumbnails for ${videoIds.length} videos, found ${foundThumbnails} thumbnails`, {
            event: 'video-thumbnail-end',
            videoCount: toFetchVideoIds.length,
            foundThumbnails,
            totalTime: Number((fetchEnd - fetchStart) / BigInt(1e+6)),
        });
    } catch (error) {
        logger.warning('Failed to fetch missing thumbnails', {
            event: 'twitch-video-fetch-failed',
            error,
        });
    }
};

export const fetchMissingThumbnails = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger
): Promise<void> => {
    const videosWithoutThumbnails = await dataSource.getRepository(Video)
        .createQueryBuilder('video')
        .where('video.thumbnailUrl IS NULL')
        .getMany();
    if (videosWithoutThumbnails.length === 0) {
        logger.info('No videos missing thumbnails', {
            event: 'video-thumbnail-skip',
        });
        return;
    }

    fetchMissingThumbnailsForVideoIds(
        apiClient,
        dataSource,
        logger,
        videosWithoutThumbnails.map(v => v.videoId)
    );
};

export const fetchVideos = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    logger: Logger
): Promise<void> => {
    const checkTime = new Date();
    const chunksWithoutVideos = await dataSource.getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .distinctOn(['stream_chunk.streamId'])
        .leftJoin(Video, 'video', 'video.streamId = stream_chunk.streamId')
        .innerJoin(TwitchChannel, 'twitch_channel', 'stream_chunk.streamerId = twitch_channel.twitchId')
        .where('video.id IS NULL')
        .andWhere('(twitch_channel.lastVideoCheck IS NULL OR twitch_channel.lastVideoCheck < :checkTime)',
            { checkTime: new Date(checkTime.getTime() - 1000 * 60 * 60) })
        .orderBy('stream_chunk.streamId', 'ASC')
        .getMany();

    const streamIds = new Set(chunksWithoutVideos.map(c => c.streamId));
    const streamerIds = new Set(chunksWithoutVideos.map(c => c.streamerId));
    const toFetch = [...streamerIds];

    if (toFetch.length > 0) {
        logger.info(`Fetching videos for ${toFetch.length} users`, {
            event: 'video-start',
            userCount: toFetch.length,
        });

        const fetchStart = process.hrtime.bigint();
        let foundVideos = 0;

        for (const userId of [...toFetch]) {
            foundVideos += await fetchVideosForUser(apiClient, dataSource, logger, userId, streamIds);
        }
        await dataSource.getRepository(TwitchChannel)
            .createQueryBuilder('twitch_channel')
            .update()
            .set({ lastVideoCheck: checkTime })
            .where('twitch_channel."twitchId" IN (:...twitchIds)', { twitchIds: toFetch })
            .execute();

        const fetchEnd = process.hrtime.bigint();

        logger.info(`Fetched videos for ${toFetch.length} users, found ${foundVideos} videos`, {
            event: 'video-end',
            userCount: toFetch.length,
            foundVideos,
            totalTime: Number((fetchEnd - fetchStart) / BigInt(1e+6)),
        });
    } else {
        logger.info('No stream segments to fetch videos for', {
            event: 'video-skip',
        });
    }

    try {
        await fetchMissingThumbnails(apiClient, dataSource, logger);
    } catch (error) {
        logger.warning('Failed to fetch video thumbnails', {
            event: 'video-thumnail-fetch-failed',
            error,
        });
    }
};

export type IntervalTimeout = ReturnType<typeof setInterval>;

export const startRefreshing = (apiClient: ApiClient, dataSource: DataSource, logger: Logger, intervalMs: number): IntervalTimeout => {
    fetchVideos(apiClient, dataSource, logger);

    return setInterval(async () => {
        await fetchVideos(apiClient, dataSource, logger);
    }, intervalMs);
};
