import { Router } from 'express';
import { ApiClient } from 'twitch';
import { DataSource } from 'typeorm';
import { FactionsResponse } from '@twrpo/types';

import { getWrpLive } from '../live/liveData';
import { getFactionInfos } from '../../factionUtils';

export const fetchFactions = async (apiClient: ApiClient, dataSource: DataSource): Promise<FactionsResponse> => {
    const liveData = await getWrpLive(apiClient, dataSource);

    return {
        factions: getFactionInfos(liveData.factionCount),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchFactions(apiClient, dataSource);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
