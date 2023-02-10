import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { FactionsResponse, UserResponse } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { getFactionInfos } from '../../factionUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { Server } from '../../db/entity/Server';
import {
    queryParamBoolean,
    queryParamString,
    queryParamInteger,
    ParamError,
} from '../../queryParams';

export interface FactionsParams {
    serverKey?: string;
    serverId?: number;
    /** Temporary flag to opt new clients out of compatibility mode */
    tempAllowNoServer?: boolean;
}

export const fetchFactions = async (
    apiClient: ApiClient,
    dataSource: DataSource,
    params: FactionsParams = {},
    currentUser: UserResponse
): Promise<FactionsResponse> => {
    const {
        serverKey: propsServerKey,
        serverId,
        tempAllowNoServer,
    } = params;

    // TODO: Temporary fallback values until we’re confident old clients are longer out in the wild
    const hasServerParam = (tempAllowNoServer === true || propsServerKey !== undefined || serverId !== undefined);
    const serverKey = hasServerParam ? propsServerKey : 'wrp';

    const server = await dataSource.getRepository(Server)
        .findOne({ where: { id: serverId, key: serverKey } });

    if (!server) {
        // TODO: Send a 404
        return { factions: [] };
    }

    if (server.key !== 'wrp') {
        // We don’t have factions for other servers
        return { factions: [] };
    }

    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);

    return {
        factions: getFactionInfos(liveData.factionCount),
    };
};

export const parseFactionsQuery = (query: Request['query'] | URLSearchParams): FactionsParams | { error: string } => {
    const params: FactionsParams = {};
    try {
        params.serverKey = queryParamString(query, 'serverKey');
        params.serverId = queryParamInteger(query, 'serverId');
        params.tempAllowNoServer = queryParamBoolean(query, 'tempAllowNoServer');
    } catch (error) {
        if (error instanceof ParamError) {
            return { error: error.message };
        }
        throw error;
    }
    return params;
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const params = parseFactionsQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchFactions(apiClient, dataSource, params, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
