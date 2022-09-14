import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource, IsNull, Not } from 'typeorm';
import { UnknownResponse, SegmentAndStreamer } from '@twrpo/types';

import { getWrpLive } from '../live/liveData';
import { fetchCharacters } from './characters';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { videoUrlOffset } from '../../utils';

export const fetchUnknown = async (apiClient: ApiClient, dataSource: DataSource): Promise<UnknownResponse> => {
    const liveData = await getWrpLive(apiClient, dataSource);
    const liveDataLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));

    const characters = await fetchCharacters(apiClient, dataSource);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );
    const unknownSegments = await dataSource.getRepository(StreamChunk)
        .find({
            where: { characterId: IsNull() },
            order: { lastSeenDate: 'desc' },
            take: 24,
            relations: {
                video: true,
                channel: true,
            },
        });
    const uncertainSegments = await dataSource.getRepository(StreamChunk)
        .find({
            where: {
                characterId: Not(IsNull()),
                characterUncertain: true,
            },
            order: { lastSeenDate: 'desc' },
            take: 24,
            relations: {
                video: true,
                channel: true,
            },
        });
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
                character: segment.characterId ? characterLookup[segment.characterId] : undefined,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataLookup[segment.id],
            },
        };
    };

    return {
        unknown: unknownSegments
            .filter(s => s.channel)
            .map(segmentAndStreamer),
        uncertain: uncertainSegments
            .filter(s => s.channel)
            .map(segmentAndStreamer),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchUnknown(apiClient, dataSource);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
