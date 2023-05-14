import { Router, Request } from 'express';
import { DataSource } from 'typeorm';
import parseurl from 'parseurl';

import { Server } from '../../../db/entity/Server';
import { SessionUser } from '../../../SessionUser';
import { fetchSessionUser } from '../whoami';
import { isGlobalAdmin } from '../../../userUtils';
import { Logger } from '../../../logger';

interface ReorderRequest {
    ids: number[];
}

const buildRouter = (dataSource: DataSource, logger: Logger): Router => {
    const router = Router();

    router.post('/', async (req: Request<any, any, ReorderRequest>, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        if (!currentUser.user) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        if (!isGlobalAdmin(currentUser)) {
            return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }

        if (req.body.ids === undefined) {
            return res.status(400).send({ success: false, errors: [{ message: 'Missing `ids` field' }] });
        }

        if (!Array.isArray(req.body.ids)) {
            return res.status(400).send({ success: false, errors: [{ message: 'Invalid `ids`. Must be an array of ids' }] });
        }

        if (req.body.ids.some(id => typeof id !== 'number')) {
            return res.status(400).send({ success: false, errors: [{ message: 'Invalid `ids`. Must be an array of ids' }] });
        }

        if (req.body.ids.length === 0) {
            return res.status(400).send({ success: false, errors: [{ message: 'Invalid `ids`. Not be empty' }] });
        }

        for (const id of req.body.ids) {
            const count = await dataSource.getRepository(Server).countBy({ id });
            if (count !== 1) {
                return res.status(400).send({ success: false, errors: [{ message: `'${id}' is not a valid id` }] });
            }
        }

        try {
            await dataSource.transaction(async (entityManager) => {
                for (let sortOrder = 0; sortOrder < req.body.ids.length; sortOrder++) {
                    const id = req.body.ids[sortOrder];
                    await entityManager.getRepository(Server).save({
                        id,
                        sortOrder,
                    });
                }
            });
        } catch (error) {
            logger.error('Failed to reorder servers', {
                path: parseurl.original(req)?.pathname,
                request: req.body,
                error,
            });
            return res.status(500).send({ success: false, errors: [{ message: 'Unable to reorder servers' }] });
        }

        return res.send({ success: true });
    });

    return router;
};

export default buildRouter;
