import { Router, Request } from 'express';
import { DataSource } from 'typeorm';
import { TimeseriesResponse, UserResponse } from '@twrpo/types';

import { Server } from '../../db/entity/Server';
import { TwitchChannel } from '../../db/entity/TwitchChannel';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import {
    queryParamDate,
    queryParamString,
    queryParamInteger,
    ParamError,
} from '../../queryParams';

export interface TimeseriesParams {
    metric?: 'streamers' | 'viewers';
    start?: Date;
    end?: Date;
    serverKey?: string;
    serverId?: number;
    channelTwitchId?: string;
}

export const fetchTimeseries = async (
    dataSource: DataSource,
    params: TimeseriesParams,
    currentUser: UserResponse
): Promise<TimeseriesResponse> => {
    const {
        metric = 'streamers',
        start,
        end,
        serverKey,
        serverId,
        channelTwitchId,
    } = params;

    if (serverKey === undefined && serverId === undefined && channelTwitchId === undefined) {
        // TODO: Error?
        return { data: [] };
    }

    if (metric !== 'streamers' && metric !== 'viewers') {
        // TODO: Error?
        return { data: [] };
    }

    const queryParams: any[] = [];

    let primaryFilterPart: string;

    if ((serverKey !== undefined || serverId !== undefined) && channelTwitchId !== undefined) {
        const server = await dataSource.getRepository(Server)
            .findOne({ where: { id: serverId, key: serverKey } });
        const twitchChannel = await dataSource.getRepository(TwitchChannel)
            .findOne({ where: { twitchId: channelTwitchId } });
        if (!twitchChannel || !server) {
            // TODO: Error?
            return { data: [] };
        }
        queryParams.push(server.id);
        const serverQueryParam = `$${queryParams.length}`;
        queryParams.push(twitchChannel.twitchId);
        const channelQueryParam = `$${queryParams.length}`;
        primaryFilterPart = `stream_chunk."serverId" = ${serverQueryParam} AND stream_chunk."streamerId" = ${channelQueryParam}`;
    } else if (serverKey !== undefined || serverId !== undefined) {
        const server = await dataSource.getRepository(Server)
            .findOne({ where: { id: serverId, key: serverKey } });
        if (!server) {
            // TODO: Error?
            return { data: [] };
        }
        queryParams.push(server.id);
        const serverQueryParam = `$${queryParams.length}`;
        primaryFilterPart = `stream_chunk."serverId" = ${serverQueryParam}`;
    } else {
        const twitchChannel = await dataSource.getRepository(TwitchChannel)
            .findOne({ where: { twitchId: channelTwitchId } });
        if (!twitchChannel) {
            // TODO: Error?
            return { data: [] };
        }
        queryParams.push(twitchChannel.twitchId);
        const channelQueryParam = `$${queryParams.length}`;
        primaryFilterPart = `stream_chunk."streamerId" = ${channelQueryParam}`;
    }

    let startDateQueryPart: string;
    if (start) {
        startDateQueryPart = `('${start.toISOString()}'::timestamp with time zone at time zone 'utc')::timestamp`;
    } else if (metric === 'viewers') {
        startDateQueryPart = `(SELECT "time" FROM stream_chunk_stat JOIN stream_chunk ON stream_chunk.id = stream_chunk_stat."streamChunkId" WHERE ${primaryFilterPart} ORDER BY "time" ASC LIMIT 1)`;
    } else {
        startDateQueryPart = `(SELECT "firstSeenDate" FROM stream_chunk WHERE ${primaryFilterPart} ORDER BY "firstSeenDate" ASC LIMIT 1)`;
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

    let query: string;

    if (metric === 'streamers') {
        query = `
            SELECT d AS date, c.n AS count
                FROM   generate_series(
                          ${startDateQueryPart},
                          ${endDateQueryPart},
                          '${stepQueryPart}'
                        ) d
                CROSS  JOIN LATERAL (
                   SELECT count(DISTINCT "streamerId")::int AS n
                   FROM   stream_chunk
                   WHERE  ${primaryFilterPart}
                   AND    tsrange("firstSeenDate", "lastSeenDate") && tsrange(d, d + '${stepQueryPart}'::INTERVAL)
                ) c
                ORDER  BY date ASC;
        `;
    } else { // metric === 'viewers'
        query = `
            WITH relevant_stat AS (
              SELECT
                "time",
                "streamerId",
                "viewerCount"
                FROM stream_chunk
                INNER JOIN stream_chunk_stat ON stream_chunk.id = stream_chunk_stat."streamChunkId"
                WHERE ${primaryFilterPart}
                AND tsrange("firstSeenDate", "lastSeenDate") && tsrange(${startDateQueryPart}, ${endDateQueryPart})
            )
            SELECT
              d AS date,
              SUM(c.n)::int AS count
              FROM generate_series(
                ${startDateQueryPart},
                ${endDateQueryPart},
                '${stepQueryPart}'
              ) d
              CROSS JOIN LATERAL (
                SELECT
                  MAX("viewerCount") AS n
                  FROM relevant_stat
                  WHERE "time" > d
                  AND "time" < (d + '${stepQueryPart}'::INTERVAL)
                  GROUP BY "streamerId"
                UNION ALL (SELECT 0 as n)
              ) c
              GROUP BY d.d
              ORDER BY date ASC;
        `;
    }

    const results: { date: string, count: number }[] = await dataSource
        .query(query, queryParams);
    return { data: results };
};

export const parseTimeseriesQuery = (query: Request['query'] | URLSearchParams): TimeseriesParams | { error: string } => {
    const params: TimeseriesParams = {};
    try {
        const metric = queryParamString(query, 'metric');
        if (metric !== undefined && metric !== 'streamers' && metric !== 'viewers') {
            return { error: '`metric` parameter must be either "streamers" or "viewers"' };
        }
        params.metric = metric;
        params.start = queryParamDate(query, 'start');
        params.end = queryParamDate(query, 'end');
        params.serverKey = queryParamString(query, 'serverKey');
        params.serverId = queryParamInteger(query, 'serverId');
        params.channelTwitchId = queryParamString(query, 'channelTwitchId');
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
