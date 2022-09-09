import { ApiClient, HelixForwardPagination } from '@twurple/api';
import { DataSource } from 'typeorm';

import { StreamChunk } from './db/entity/StreamChunk';
import { TwitchChannel } from './db/entity/TwitchChannel';
import { Stream } from './db/entity/Stream';

export const fetchVideos = async (
    apiClient: ApiClient,
    dataSource: DataSource
): Promise<void> => {
    const checkTime = new Date();
    const chunksWithoutVideos = await dataSource.getRepository(StreamChunk)
        .createQueryBuilder('stream_chunk')
        .distinctOn(['stream_chunk.streamId'])
        .leftJoin(Stream, 'stream', 'stream.streamId = stream_chunk.streamId')
        .innerJoin(TwitchChannel, 'twitch_channel', 'stream_chunk.streamerId = twitch_channel.twitchId')
        .where('stream.id IS NULL')
        .andWhere('(twitch_channel.lastVideoCheck IS NULL OR twitch_channel.lastVideoCheck < :checkTime)',
            { checkTime: new Date(checkTime.getTime() - 1000 * 60 * 60) })
        .orderBy('stream_chunk.streamId', 'ASC')
        .getMany();

    const streamIds = new Set(chunksWithoutVideos.map(c => c.streamId));
    const streamerIds = new Set(chunksWithoutVideos.map(c => c.streamerId));
    const toFetch = [...streamerIds];

    if (toFetch.length === 0) {
        console.log(JSON.stringify({
            level: 'info',
            message: 'No stream segments to fetch videos for',
            event: 'video-skip',
        }));
        return;
    }

    console.log(JSON.stringify({
        level: 'info',
        message: `Fetching videos for ${toFetch.length} users`,
        event: 'video-start',
        userCount: toFetch.length,
    }));

    const fetchStart = process.hrtime.bigint();
    let foundVideos = 0;

    for (const userId of [...toFetch]) {
        let pages = 10;
        let after: HelixForwardPagination['after'];
        try {
            while (pages > 0) {
                console.log(JSON.stringify({
                    level: 'info',
                    message: `Fetching videos page “${11 - pages}” for ${userId}`,
                    event: 'video-fetch',
                    userId,
                }));
                const videos = await apiClient.videos.getVideosByUser(userId, {
                    type: 'archive',
                    after,
                    limit: 100,
                });
                for (const video of videos.data) {
                    if (video.streamId && streamIds.has(video.streamId)) {
                        await dataSource.getRepository(Stream).insert({
                            videoId: video.id,
                            streamId: video.streamId,
                            streamerId: video.userId,
                            streamCreatedDate: video.creationDate,
                            streamPublishedDate: video.publishDate,
                            url: video.url,
                            thumbnailUrl: video.thumbnailUrl,
                            title: video.title,
                            duration: video.duration,
                        });
                        console.log(JSON.stringify({
                            level: 'info',
                            message: `Found video “${video.title}” for ${video.userDisplayName}`,
                            event: 'video-found',
                            channel: video.userDisplayName,
                            title: video.title,
                        }));
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
            console.log(JSON.stringify({
                level: 'warning',
                message: `Failed to fetch page “${11 - pages}” for ${userId}`,
                event: 'video-fetch',
                error,
            }));
        }
    }
    await dataSource.getRepository(TwitchChannel)
        .createQueryBuilder('twitch_channel')
        .update()
        .set({ lastVideoCheck: checkTime })
        .where('twitch_channel."twitchId" IN (:...twitchIds)', { twitchIds: toFetch })
        .execute();

    const fetchEnd = process.hrtime.bigint();

    console.log(JSON.stringify({
        level: 'info',
        message: `Fetched videos for ${toFetch.length} users, found ${foundVideos} videos`,
        event: 'video-end',
        userCount: toFetch.length,
        foundVideos,
        totalTime: Number((fetchEnd - fetchStart) / BigInt(1e+6)),
    }));
};

export type IntervalTimeout = ReturnType<typeof setInterval>;

export const startRefreshing = (apiClient: ApiClient, dataSource: DataSource, intervalMs: number): IntervalTimeout => {
    fetchVideos(apiClient, dataSource);

    return setInterval(async () => {
        await fetchVideos(apiClient, dataSource);
    }, intervalMs);
};
