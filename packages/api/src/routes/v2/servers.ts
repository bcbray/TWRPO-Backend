import { Router } from 'express';
import { DataSource } from 'typeorm';
import { ServersResponse, UserResponse } from '@twrpo/types';

import { Server } from '../../db/entity/Server';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import { isGlobalAdmin } from '../../userUtils';

export const fetchServers = async (dataSource: DataSource, currentUser: UserResponse): Promise<ServersResponse> => {
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
        })),
    };
};

const buildRouter = (dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const result = await fetchServers(dataSource, currentUser);
        return res.send(result);
    });

    return router;
};

export default buildRouter;
