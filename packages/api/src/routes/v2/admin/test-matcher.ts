import { Router, Request } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';

import { Server } from '../../../db/entity/Server';
import {
    queryParamString,
    ParamError,
} from '../../../queryParams';
import { parseServer, matchServer } from '../../../matcher/server';

interface TestMatcherParams {
    channel?: string;
}

export const parseTestMatcherQuery = (query: Request['query'] | URLSearchParams): TestMatcherParams | { error: string } => {
    const params: TestMatcherParams = {};
    try {
        params.channel = queryParamString(query, 'channel');
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
        // const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        // if (!currentUser.user) {
        //     return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        // }
        // if (!isGlobalAdmin(currentUser)) {
        //     return res.status(403).send({ success: false, errors: [{ message: 'Unauthorized' }] });
        // }

        const params = parseTestMatcherQuery(req.query);

        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }

        if (params.channel === undefined) {
            return res.status(400).send({ success: false, errors: [{ message: 'Missing `channel` parameter' }] });
        }

        const stream = await apiClient.streams.getStreamByUserName(params.channel);
        if (!stream) {
            return res.status(404).send({ success: false, errors: [{ message: `No stream found for "${params.channel}"` }] });
        }

        const servers = await dataSource.getRepository(Server).find({
            where: {
                game: {
                    twitchId: stream.gameId,
                },
            },
            relations: {
                regexes: true,
            },
        });

        if (!servers || servers.length === 0) {
            return res.status(404).send({ success: false, errors: [{ message: `No servers found for "${stream.gameName}"` }] });
        }

        console.dir(stream);
        console.dir(servers);

        const parsedServers = servers.map(parseServer);

        const matchedServer = matchServer(stream.title, parsedServers);

        // {"success":true,"game":"Red Dead Redemption 2","title":"| Lay Low Mexicano | La Santa Muerte | Ranch RP","server":{"regexes":[{}],"id":15,"gameId":2,"key":null,"name":"The Ranch RP","tagName":null,"isVisible":true,"isRoleplay":true,"createdAt":"2022-11-30T02:19:24.358Z","sortOrder":null}}%                              bencochran@Bens-MacBook-Pro ~ %

        return res.send({
            success: true,
            game: stream.gameName,
            title: stream.title,
            server: matchedServer?.name,
        });
    });

    return router;
};

export default buildRouter;
