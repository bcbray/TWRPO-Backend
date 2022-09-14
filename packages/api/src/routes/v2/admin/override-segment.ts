import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import parseurl from 'parseurl';
import { OverrideSegmentRequest } from '@twrpo/types';

import { User, UserRole } from '../../../db/entity/User';
import { StreamChunk } from '../../../db/entity/StreamChunk';
import { SessionUser } from '../../../SessionUser';
import { wrpCharacters } from '../../../data/characters';
import { getWrpLive } from '../../live/liveData';

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.post('/', async (req: Request<any, any, OverrideSegmentRequest>, res) => {
        if (!req.user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        const sessionUser: SessionUser = req.user as any;
        const user = await dataSource.getRepository(User).findOneBy({ id: sessionUser.id });
        if (!user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        if (user.globalRole !== UserRole.ADMIN && user.globalRole !== UserRole.EDITOR) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }

        if (req.body.segmentId === undefined) {
            console.error('Missing `segmentId`');
            return res.status(400).send({ success: false, errors: [{ message: 'Missing `segmentId` field' }] });
        }

        try {
            const segment = await dataSource.getRepository(StreamChunk).findOne({
                where: { id: req.body.segmentId },
                relations: {
                    channel: true,
                },
            });
            if (!segment || !segment.channel) {
                return res.status(400).send({ success: false, errors: [{ message: 'Unknown `segmentId`' }] });
            }

            // Check that it's a valid character ID for the streamer of this chunk
            if (req.body.characterId !== null) {
                const loginLower = segment.channel.displayName.toLowerCase();
                const entry = Object.entries(wrpCharacters)
                    .find(([streamer]) => streamer.toLowerCase() === loginLower);

                if (!entry) {
                    return res.status(400).send({ success: false, errors: [{ message: `No known characters for ${segment.channel.displayName}` }] });
                }

                const characters = entry[1];
                if (!characters.some(c => c.id === req.body.characterId)) {
                    return res.status(400).send({ success: false, errors: [{ message: `Character ${req.body.characterId} not associated with ${segment.channel.displayName}` }] });
                }
            }

            await dataSource.getRepository(StreamChunk).save({
                id: req.body.segmentId,
                characterId: req.body.characterId,
                characterUncertain: req.body.characterUncertain,
                isOverridden: true,
            });

            const liveData = await getWrpLive(apiClient, dataSource);
            if (liveData.streams.some(s => s.segmentId === req.body.segmentId)) {
                // If the segment is live, dorce a fetch to use the new data
                await getWrpLive(apiClient, dataSource, {}, true);
            }
        } catch (error) {
            console.error(JSON.stringify({
                level: 'error',
                message: 'Failed to override segment',
                path: parseurl.original(req)?.pathname,
                request: req.body,
                error,
            }));
            return res.status(500).send({ success: false, errors: [{ message: 'Unable to update segment' }] });
        }

        return res.send({ success: true });
    });

    return router;
};

export default buildRouter;
