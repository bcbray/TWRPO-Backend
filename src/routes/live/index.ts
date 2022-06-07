/* eslint-disable prefer-destructuring */

import { Router } from 'express';

import { mapObjKeys } from '../../utils';
import { getWrpLive } from './liveData';

import type { RecordGen } from '../../utils';

const router = Router();

router.get('/', async (req, res) => {
    // log('Handling request for /live');
    const live = await getWrpLive(
        mapObjKeys(req.query as RecordGen, ((v, k) => {
            if (k === 'faction') return 'factionName';
            return k;
        })),
        undefined, '/live'
    );
    // log('live', live);
    return res.send(live);
});

export default router;
