import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { ServersResponse, UserResponse, Stream } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { Server } from '../../db/entity/Server';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import { isGlobalAdmin } from '../../userUtils';

export const fetchServers = async (apiClient: ApiClient, dataSource: DataSource, currentUser: UserResponse): Promise<ServersResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);
    const liveDataLookup = liveData.streams.reduce((lookup, stream) => {
        if (stream.serverId === null) {
            return lookup;
        }
        if (lookup[stream.serverId] === undefined) {
            lookup[stream.serverId] = [];
        }
        lookup[stream.serverId].push(stream);
        return lookup;
    }, {} as Record<number, Stream[]>);

    const queryBuilder = dataSource
        .getRepository(Server)
        .createQueryBuilder('server')
        .leftJoinAndSelect('server.regexes', 'regex')
        .where('true')
        .orderBy('server.sortOrder', 'ASC', 'NULLS LAST')
        .addOrderBy('server.name');

    if (!isGlobalAdmin(currentUser)) {
        queryBuilder.andWhere('server.isVisible = true');
    }

    const servers = await queryBuilder.getMany();
    return {
        servers: servers.map(({
            id, name, key, isVisible, regexes,
        }) => ({
            id,
            name,
            key: key ?? undefined,
            isVisible,
            regexes: regexes.map(({ regex, isCaseSensitive }) => ({ regex, isCaseSensitive })),
            liveCount: liveDataLookup[id]?.length ?? 0,
        })),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const result = await fetchServers(apiClient, dataSource, currentUser);
        return res.send(result);
    });

    return router;
};

export default buildRouter;
