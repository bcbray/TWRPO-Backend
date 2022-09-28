import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { ServersResponse, ServerResponse, UserResponse, Stream } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { Server } from '../../db/entity/Server';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import { isGlobalAdmin } from '../../userUtils';
import { intValue } from '../../utils';

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
        .addOrderBy('server.isVisible', 'DESC')
        .addOrderBy('server.name');

    if (!isGlobalAdmin(currentUser)) {
        queryBuilder.andWhere('server.isVisible = true');
    }

    const servers = await queryBuilder.getMany();
    return {
        servers: servers.map(({
            id, key, name, tagName, isVisible, isRoleplay, regexes,
        }) => ({
            id,
            key: key ?? undefined,
            name,
            tagName,
            isVisible,
            isRoleplay,
            regexes: regexes.map(({ id: rid, regex, isCaseSensitive }) => ({ id: rid, regex, isCaseSensitive })),
            liveCount: liveDataLookup[id]?.length ?? 0,
        })),
    };
};

const findServer = async (dataSource: DataSource, identifier: string): Promise<Server | null> => {
    const id = intValue(identifier);
    if (id !== null) {
        const serverById = await dataSource
            .getRepository(Server)
            .findOne({
                where: { id },
                relations: {
                    game: true,
                    regexes: true,
                },
            });
        if (serverById) {
            return serverById;
        }
    }

    return dataSource
        .getRepository(Server)
        .findOne({
            where: { key: identifier },
            relations: {
                game: true,
                regexes: true,
            },
        });
};

export const fetchServer = async (apiClient: ApiClient, dataSource: DataSource, identifier: string, currentUser: UserResponse): Promise<ServerResponse | null> => {
    const server = await findServer(dataSource, identifier);

    if (!server) {
        return null;
    }

    if (!server.game) {
        return null;
    }

    if (!server.isVisible && !isGlobalAdmin(currentUser)) {
        return null;
    }

    const liveData = await getFilteredWrpLive(apiClient, dataSource, currentUser);
    const liveCount = liveData.streams.reduce((total, stream) => (
        stream.serverId === server.id ? total + 1 : total
    ), 0);

    return {
        server: {
            id: server.id,
            key: server.key ?? undefined,
            name: server.name,
            tagName: server.tagName,
            isVisible: server.isVisible,
            isRoleplay: server.isRoleplay,
            regexes: server.regexes.map(({ id: rid, regex, isCaseSensitive }) => ({ id: rid, regex, isCaseSensitive })),
            liveCount,
        },
        game: {
            id: server.game.id,
            key: server.game.key ?? undefined,
            name: server.game.name,
            boxArtUrl: server.game.boxArtUrl,
        },
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const result = await fetchServers(apiClient, dataSource, currentUser);
        return res.send(result);
    });

    router.get('/:identifier', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const { identifier } = req.params;
        const response = await fetchServer(apiClient, dataSource, identifier, userResponse);
        if (!response) {
            return res
                .status(404)
                .send({ success: false, errors: [{ message: `Server '${identifier}' not found` }] });
        }
        return res.send(response);
    });

    return router;
};

export default buildRouter;
