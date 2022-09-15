import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { VideoSegment } from '@twrpo/types';

import { getWrpLive } from '../live/liveData';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { videoUrlOffset } from '../../utils';
import { fetchCharacters } from './characters';

export const fetchSegment = async (apiClient: ApiClient, dataSource: DataSource, id: number): Promise<VideoSegment | null> => {
    const segment = await dataSource
        .getRepository(StreamChunk)
        .findOne({
            where: { id },
            relations: {
                video: true,
                channel: true,
            },
        });

    if (!segment) {
        return null;
    }

    const liveData = await getWrpLive(apiClient, dataSource);
    const liveInfo = liveData.streams.find(s => s.segmentId === segment.id);

    const characters = await fetchCharacters(apiClient, dataSource);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );

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
        character: segment.characterId ? characterLookup[segment.characterId] : null,
        characterUncertain: segment.characterUncertain,
        liveInfo,
        streamId: segment.streamId,
        isHidden: segment.isHidden,
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/:id', async (req, res) => {
        const { id: idString } = req.params;
        const id = Math.floor(Number(idString));
        if (!Number.isFinite(id) || Number.isNaN(id) || String(id) !== idString) {
            return res
                .status(400)
                .send({ success: false, errors: [{ message: `'${idString}' is not a valid id` }] });
        }
        const response = await fetchSegment(apiClient, dataSource, id);
        if (!response) {
            return res
                .status(404)
                .send({ success: false, errors: [{ message: `Segment with id '${id}' not found` }] });
        }
        return res.send(response);
    });

    return router;
};

export default buildRouter;
