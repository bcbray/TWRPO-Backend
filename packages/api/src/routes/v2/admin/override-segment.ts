import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import parseurl from 'parseurl';
import { OverrideSegmentRequest } from '@twrpo/types';

import { StreamChunk } from '../../../db/entity/StreamChunk';
import { SessionUser } from '../../../SessionUser';
import { wrpCharacters } from '../../../data/characters';
import { getFilteredWrpLive, forceWrpLiveRefresh } from '../../live/liveData';
import { fetchSessionUser } from '../whoami';
import { isEditorForTwitchId } from '../../../userUtils';

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.post('/', async (req: Request<any, any, OverrideSegmentRequest>, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        if (!currentUser.user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        if (!req.user) {
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

            if (!isEditorForTwitchId(segment.channel.twitchId, currentUser)) {
                return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
            }

            if (req.body.characterId === undefined && req.body.characterUncertain === undefined && req.body.isHidden === undefined) {
                return res.send({ success: true, message: 'No changes.' });
            }

            // Check that it's a valid character ID for the streamer of this chunk
            if (req.body.characterId !== undefined && req.body.characterId !== null) {
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

            const update: Partial<Pick<StreamChunk, 'characterId' | 'characterUncertain' | 'isOverridden' | 'isHidden'>> = {};

            if (req.body.characterUncertain !== undefined) {
                update.characterUncertain = req.body.characterUncertain;
                update.isOverridden = true;
            }

            if (req.body.characterId !== undefined) {
                if (req.body.characterId === null) {
                    update.characterUncertain = false;
                }
                update.characterId = req.body.characterId;
                update.isOverridden = true;
            }

            if (req.body.isHidden !== undefined) {
                update.isHidden = req.body.isHidden;
            }

            await dataSource.getRepository(StreamChunk).save({
                id: segment.id,
                ...update,
            });

            const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);
            if (req.body.isHidden === false || liveData.streams.some(s => s.segmentId === req.body.segmentId)) {
                // If the segment is live (or if we've just unhidden a segment), force a fetch to use the new data
                await forceWrpLiveRefresh(apiClient, dataSource);
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
