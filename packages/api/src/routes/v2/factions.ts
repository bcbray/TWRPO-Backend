import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { FactionsResponse, UserResponse } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { getFactionInfos } from '../../factionUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';

export const fetchFactions = async (apiClient: ApiClient, dataSource: DataSource, currentUser: UserResponse): Promise<FactionsResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);

    return {
        factions: getFactionInfos(liveData.factionCount),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchFactions(apiClient, dataSource, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
