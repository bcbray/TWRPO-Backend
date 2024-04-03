import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import parseurl from 'parseurl';
import { OverrideMultipleSegmentsRequest } from '@twrpo/types';

import { StreamChunk } from '../../../db/entity/StreamChunk';
import { SessionUser } from '../../../SessionUser';
import { wrpCharacters } from '../../../data/characters';
import { getFilteredWrpLive, forceWrpLiveRefresh } from '../../live/liveData';
import { fetchSessionUser } from '../whoami';
import { isEditorForTwitchId } from '../../../userUtils';
import { Logger } from '../../../logger';

const buildRouter = (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Router => {
    const router = Router();

    router.post('/', async (req: Request<any, any, OverrideMultipleSegmentsRequest>, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        if (!currentUser.user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        if (!req.user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }

        if (req.body.overrides === undefined) {
            logger.error('Missing `overrides`');
            return res.status(400).send({ success: false, errors: [{ message: 'Missing `overrides` field' }] });
        }

        if (req.body.overrides.length === 0) {
            return res.send({ success: true, message: 'Nothing to do.' });
        }

        type Update = Partial<Pick<StreamChunk, 'characterId' | 'characterUncertain' | 'isOverridden' | 'isHidden' | 'serverId' | 'serverUncertain'>> & Pick<StreamChunk, 'id'>;
        const updates: Update[] = [];

        for (const request of req.body.overrides) {
            if (request.segmentId === undefined) {
                logger.error('Missing `segmentId`');
                return res.status(400).send({ success: false, errors: [{ message: 'Missing `segmentId` field' }] });
            }

            const segment = await dataSource.getRepository(StreamChunk).findOne({
                where: { id: request.segmentId },
                relations: {
                    channel: true,
                },
            });
            if (!segment || !segment.channel) {
                return res.status(400).send({ success: false, errors: [{ message: `Unknown \`segmentId\` ${request.segmentId}` }] });
            }

            if (!isEditorForTwitchId(segment.channel.twitchId, currentUser)) {
                return res.status(403).send({ success: false, errors: [{ message: `Unauthorized to override \`segmentId\` ${request.segmentId}` }] });
            }

            if (
                request.characterId === undefined
                && request.characterUncertain === undefined
                && request.isHidden === undefined
                && request.serverId === undefined
                && request.serverUncertain === undefined
            ) {
                continue;
            }

            // Check that it's a valid character ID for the streamer of this chunk
            if (request.characterId !== undefined && request.characterId !== null) {
                const loginLower = segment.channel.displayName.toLowerCase();
                const entry = Object.entries(wrpCharacters)
                    .find(([streamer]) => streamer.toLowerCase() === loginLower);

                if (!entry) {
                    return res.status(400).send({ success: false, errors: [{ message: `No known characters for ${segment.channel.displayName}` }] });
                }

                const characters = entry[1];
                if (!characters.some(c => c.id === request.characterId)) {
                    return res.status(400).send({ success: false, errors: [{ message: `Character ${request.characterId} not associated with ${segment.channel.displayName}` }] });
                }
            }

            const update: Update = { id: segment.id };

            if (request.characterUncertain !== undefined) {
                update.characterUncertain = request.characterUncertain;
                update.isOverridden = true;
            }

            if (request.characterId !== undefined) {
                if (request.characterId === null) {
                    update.characterUncertain = false;
                }
                update.characterId = request.characterId;
                update.isOverridden = true;
            }

            if (request.serverId !== undefined) {
                update.serverId = request.serverId;
                update.isOverridden = true;
            }

            if (request.serverUncertain !== undefined) {
                update.serverUncertain = request.serverUncertain;
                update.isOverridden = true;
            }

            if (request.isHidden !== undefined) {
                update.isHidden = request.isHidden;
            }

            updates.push(update);
        }

        if (updates.length === 0) {
            return res.send({ success: true, message: 'No changes.' });
        }

        try {
            dataSource.getRepository(StreamChunk).save(updates);

            const liveData = await getFilteredWrpLive(apiClient, dataSource, logger, currentUser);
            const updatedSegmentIDs = new Set(updates.map(u => u.id));
            const anyUnhidden = req.body.overrides.some(o => o.isHidden === false);
            const updatedLiveSegment = liveData.streams.some(s => updatedSegmentIDs.has(s.segmentId));
            if (anyUnhidden || updatedLiveSegment) {
                // If the segment is live (or if we've just unhidden a segment), force a fetch to use the new data
                await forceWrpLiveRefresh(apiClient, dataSource, logger);
            }
        } catch (error) {
            logger.error('Failed to override segments', {
                path: parseurl.original(req)?.pathname,
                request: req.body,
                error,
            });
            return res.status(500).send({ success: false, errors: [{ message: 'Unable to update segments' }] });
        }

        return res.send({ success: true });
    });

    return router;
};

export default buildRouter;
