import { Router, Request } from 'express';
import { DataSource } from 'typeorm';
import { TimeseriesResponse, UserResponse } from '@twrpo/types';

import { Server } from '../../db/entity/Server';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import {
    queryParamDate,
    queryParamString,
    queryParamInteger,
    ParamError,
} from '../../queryParams';
import { isGlobalEditor } from '../../userUtils';

export interface TimeseriesParams {
    start?: Date;
    end?: Date;
    serverKey?: string;
    serverId?: number;
}

export const fetchTimeseries = async (
    dataSource: DataSource,
    params: TimeseriesParams,
    currentUser: UserResponse
): Promise<TimeseriesResponse> => {
    // Temporarily restrict to editors
    if (!isGlobalEditor(currentUser)) {
        // TODO: Error?
        return { data: [] };
    }

    const {
        start,
        end,
        serverKey,
        serverId,
    } = params;

    if (serverKey === undefined && serverId === undefined) {
        // TODO: Error?
        return { data: [] };
    }

    const server = await dataSource.getRepository(Server)
        .findOne({ where: { id: serverId, key: serverKey } });

    if (!server) {
        // TODO: Error?
        return { data: [] };
    }

    const queryParams: any[] = [];

    queryParams.push(server.id);
    const serverQueryParam = `$${queryParams.length}`;

    let startDateQueryPart: string;
    if (start) {
        startDateQueryPart = `('${start.toISOString()}'::timestamp with time zone at time zone 'utc')::timestamp`;
    } else {
        startDateQueryPart = `(SELECT "firstSeenDate" FROM stream_chunk WHERE  "serverId" = ${serverQueryParam} ORDER BY "firstSeenDate" ASC LIMIT 1)`;
    }

    let endDateQueryPart: string;
    let endDate: Date;
    if (end) {
        endDateQueryPart = `('${end.toISOString()}'::timestamp with time zone at time zone 'utc')::timestamp`;
        endDate = end;
    } else {
        endDateQueryPart = 'now()::timestamp';
        endDate = new Date();
    }

    const deltaDays = start === undefined ? undefined : (endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    let stepQueryPart: string;
    if (deltaDays === undefined || deltaDays > 10) {
        stepQueryPart = '1 hour';
        startDateQueryPart = `date_trunc('hour', ${startDateQueryPart})`;
    } else if (deltaDays > 2) {
        stepQueryPart = '20 min';
        startDateQueryPart = `date_trunc('hour', ${startDateQueryPart}) + date_part('minute', ${startDateQueryPart})::INT / 20 * '20 min'::INTERVAL`;
    } else {
        stepQueryPart = '5 min';
        startDateQueryPart = `date_trunc('hour', ${startDateQueryPart}) + date_part('minute', ${startDateQueryPart})::INT / 5 * '5 min'::INTERVAL`;
    }

    const query = `
        SELECT d AS date, c.n AS count
            FROM   generate_series(
                      ${startDateQueryPart},
                      ${endDateQueryPart},
                      '${stepQueryPart}'
                    ) d
            CROSS  JOIN LATERAL (
               SELECT count(DISTINCT "streamerId")::int AS n
               FROM   stream_chunk
               WHERE  "serverId" = ${serverQueryParam}
               AND    tsrange("firstSeenDate", "lastSeenDate") && tsrange(d, d + '${stepQueryPart}'::INTERVAL)
            ) c
            ORDER  BY date ASC;
    `;

    const results: { date: string, count: number }[] = await dataSource
        .query(query, queryParams);
    return { data: results };
};

export const parseTimeseriesQuery = (query: Request['query'] | URLSearchParams): TimeseriesParams | { error: string } => {
    const params: TimeseriesParams = {};
    try {
        params.start = queryParamDate(query, 'start');
        params.end = queryParamDate(query, 'end');
        params.serverKey = queryParamString(query, 'serverKey');
        params.serverId = queryParamInteger(query, 'serverId');
    } catch (error) {
        if (error instanceof ParamError) {
            return { error: '`cursor` parameter must be a string' };
        }
        throw error;
    }
    return params;
};

const buildRouter = (dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const params = parseTimeseriesQuery(req.query);
        if ('error' in params) {
            const { error } = params;
            return res.status(400).send({ success: false, error });
        }
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const result = await fetchTimeseries(dataSource, params, currentUser);
        return res.send(result);
    });

    return router;
};

export default buildRouter;
