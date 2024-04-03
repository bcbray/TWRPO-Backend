import express, { Router } from 'express';
import cors from 'cors';
import { ApiClient, HelixUser, HelixUserData } from '@twurple/api';
import { AuthProvider } from '@twurple/auth';
import { LogLevel } from '@d-fischer/logger';
import { DataSource, Repository } from 'typeorm';
import {
    CharactersResponse,
    FactionsResponse,
    LiveResponse,
    StreamerResponse,
    StreamersResponse,
    UnknownResponse,
    UserResponse,
    VideoSegment,
    StreamsResponse,
    ServersResponse,
    ServerResponse,
} from '@twrpo/types';

import { getFilteredWrpLive, startRefreshing as startRefreshingLive, IntervalTimeout } from './routes/live/liveData';
import { fetchCharacters, parseCharactersQuery, CharactersParams } from './routes/v2/characters';
import { fetchFactions, parseFactionsQuery, FactionsParams } from './routes/v2/factions';
import { fetchStreamer, fetchStreamers } from './routes/v2/streamers';
import { fetchUnknown } from './routes/v2/unknown';
import { fetchSegment } from './routes/v2/segments';
import {
    fetchLiveStreams,
    fetchRecentStreams,
    fetchStreams,
    fetchUnknownStreams,
    StreamsParams,
    parseStreamsQuery,
} from './routes/v2/streams';
import { fetchServer, fetchServers } from './routes/v2/servers';
import { fetchSessionUser } from './routes/v2/whoami';
import routes from './routes';
import dataSource from './db/dataSource';
import { SessionUser } from './SessionUser';
import { Session } from './db/entity/Session';
import { User } from './db/entity/User';
import { TwitchChannel } from './db/entity/TwitchChannel';
import { startRefreshing as startRefreshingVideos } from './fetchVideos';
import { Logger, LogMethod } from './logger';

interface ApiOptions {
    twitchAuthProvider: AuthProvider;
    postgresUrl: string;
    postgresInsecure?: boolean;
    liveRefreshInterval?: number;
    videoRefreshInterval?: number;
    databaseStatsLogInterval?: number;
    databasePartitionMaintenanceInterval?: number;
    logger?: Logger;
}

class Api {
    twitchClient: ApiClient;

    apiRouter: Router;

    logger: Logger;

    private dataSource: DataSource;

    private liveRefreshInterval: number;

    private liveRefreshTimeout: IntervalTimeout | null;

    private videoRefreshInterval: number;

    private videoRefreshInitialTimeout: IntervalTimeout | null;

    private videoRefreshTimeout: IntervalTimeout | null;

    private databaseStatsLogInterval: number;

    private databaseStatsLogTimeout: IntervalTimeout | null;

    private databasePartitionMaintenanceInterval: number;

    private databasePartitionMaintenanceTimeout: IntervalTimeout | null;

    constructor(options: ApiOptions) {
        this.logger = options.logger ?? {
            emerg: console.error,
            alert: console.error,
            crit: console.error,
            error: console.error,
            warning: console.warn,
            notice: console.warn,
            info: console.info,
            debug: console.debug,
        };
        this.twitchClient = new ApiClient({
            logger: {
                minLevel: LogLevel.WARNING,
                custom: (level, message) => {
                    let method: LogMethod = this.logger.info;
                    if (level === LogLevel.CRITICAL) {
                        method = this.logger.error;
                    } else if (level === LogLevel.ERROR) {
                        method = this.logger.error;
                    } else if (level === LogLevel.WARNING) {
                        method = this.logger.warning;
                    } else if (level === LogLevel.INFO) {
                        method = this.logger.info;
                    } else if (level === LogLevel.DEBUG) {
                        method = this.logger.debug;
                    } else if (level === LogLevel.TRACE) {
                        method = this.logger.debug;
                    }
                    method(message, { event: 'twitch-api-log' });
                },
            },
            authProvider: options.twitchAuthProvider,
        });
        this.dataSource = dataSource({
            postgresUrl: options.postgresUrl,
            insecure: options.postgresInsecure,
        });

        this.apiRouter = Router();
        this.apiRouter.use(cors());
        this.apiRouter.use(express.json());
        this.apiRouter.use('/v1/live', routes.liveRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/characters', routes.v2CharactersRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/factions', routes.v2FactionsRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/streamers', routes.v2StreamersRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/unknown', routes.v2UnknownRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/segments', routes.v2SegmentsRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/streams', routes.v2StreamsRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/servers', routes.v2ServersRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/whoami', routes.v2WhoamiRouter(this.dataSource));
        this.apiRouter.use('/v2/submit-feedback', routes.v2FeedbackRouter(this.dataSource, this.logger));
        this.apiRouter.use('/v2/users', routes.v2UsersRouter(this.dataSource));
        this.apiRouter.use('/v2/timeseries', routes.v2TimeseriesRouter(this.dataSource));
        this.apiRouter.use('/v2/admin/override-segment', routes.v2AdminOverrideSegmentRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/admin/override-multiple-segments', routes.v2AdminOverrideMultipleSegmentsRouter(this.twitchClient, this.dataSource, this.logger));
        this.apiRouter.use('/v2/admin/reorder-servers', routes.v2AdminReorderServersRouter(this.dataSource, this.logger));
        this.apiRouter.use('/v2/admin/test-matcher', routes.v2AdminTestMatcherRouter(this.twitchClient, this.dataSource, this.logger));

        const { liveRefreshInterval = 1000 * 60 } = options;
        this.liveRefreshInterval = liveRefreshInterval;

        const { videoRefreshInterval = 1000 * 60 * 10 } = options;
        this.videoRefreshInterval = videoRefreshInterval;

        const { databaseStatsLogInterval = 1000 * 60 * 20 } = options;
        this.databaseStatsLogInterval = databaseStatsLogInterval;

        const { databasePartitionMaintenanceInterval = 1000 * 60 * 60 * 24 } = options;
        this.databasePartitionMaintenanceInterval = databasePartitionMaintenanceInterval;
    }

    public async initialize(): Promise<void> {
        await this.dataSource.initialize();
        this.startLoggingDatabaseCounts();
        this.startDatabasePartitionMaintenance();
    }

    public async fetchLive(currentUser: UserResponse): Promise<LiveResponse> {
        return getFilteredWrpLive(this.twitchClient, this.dataSource, this.logger, currentUser);
    }

    public async fetchFactionsWithQuery(query: string | undefined, currentUser: UserResponse): Promise<FactionsResponse> {
        const params = parseFactionsQuery(new URLSearchParams(query));
        if ('error' in params) {
            this.logger.error('Invalid query', { params });
            return { factions: [] };
        }
        return this.fetchFactions(params, currentUser);
    }

    public async fetchFactions(params: FactionsParams, currentUser: UserResponse): Promise<FactionsResponse> {
        return fetchFactions(this.twitchClient, this.dataSource, this.logger, params, currentUser);
    }

    public async fetchCharactersWithQuery(query: string | undefined, currentUser: UserResponse): Promise<CharactersResponse> {
        const params = parseCharactersQuery(new URLSearchParams(query));
        if ('error' in params) {
            this.logger.error('Invalid query', { params });
            return { characters: [], factions: [] };
        }
        return this.fetchCharacters(params, currentUser);
    }

    public async fetchCharacters(params: CharactersParams | undefined, currentUser: UserResponse): Promise<CharactersResponse> {
        return fetchCharacters(this.twitchClient, this.dataSource, this.logger, params, currentUser);
    }

    public async fetchStreamer(name: string, currentUser: UserResponse): Promise<StreamerResponse | null> {
        return fetchStreamer(this.twitchClient, this.dataSource, this.logger, name, currentUser);
    }

    public async fetchStreamers(currentUser: UserResponse): Promise<StreamersResponse> {
        return fetchStreamers(this.twitchClient, this.dataSource, this.logger, currentUser);
    }

    public async fetchUnknown(currentUser: UserResponse): Promise<UnknownResponse> {
        return fetchUnknown(this.twitchClient, this.dataSource, this.logger, currentUser);
    }

    public async fetchSegment(id: number, currentUser: UserResponse): Promise<VideoSegment | null> {
        return fetchSegment(this.twitchClient, this.dataSource, this.logger, id, currentUser);
    }

    public async fetchLiveStreams(currentUser: UserResponse): Promise<StreamsResponse> {
        return fetchLiveStreams(this.twitchClient, this.dataSource, this.logger, {}, currentUser);
    }

    public async fetchRecentStreamsWithQuery(query: string | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        const params = parseStreamsQuery(new URLSearchParams(query));
        if ('error' in params) {
            this.logger.error('Invalid query', { params });
            return { streams: [], lastRefreshTime: new Date().toISOString() };
        }
        const result = this.fetchRecentStreams(params, currentUser);
        return result;
    }

    public async fetchRecentStreams(params: StreamsParams | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        return fetchRecentStreams(this.twitchClient, this.dataSource, this.logger, params, currentUser);
    }

    public async fetchStreamsWithQuery(query: string | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        const params = parseStreamsQuery(new URLSearchParams(query));
        if ('error' in params) {
            this.logger.error('Invalid query', { params });
            return { streams: [], lastRefreshTime: new Date().toISOString() };
        }
        const result = this.fetchStreams(params, currentUser);
        return result;
    }

    public async fetchStreams(params: StreamsParams | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        return fetchStreams(this.twitchClient, this.dataSource, this.logger, params, currentUser);
    }

    public async fetchUnknownStreamsWithQuery(query: string | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        const params = parseStreamsQuery(new URLSearchParams(query));
        if ('error' in params) {
            this.logger.error('Invalid query', { params });
            return { streams: [], lastRefreshTime: new Date().toISOString() };
        }
        return this.fetchUnknownStreams(params, currentUser);
    }

    public async fetchUnknownStreams(params: StreamsParams | undefined, currentUser: UserResponse): Promise<StreamsResponse> {
        return fetchUnknownStreams(this.twitchClient, this.dataSource, this.logger, params, currentUser);
    }

    public async fetchServer(key: string, currentUser: UserResponse): Promise<ServerResponse | null> {
        return fetchServer(this.twitchClient, this.dataSource, this.logger, key, currentUser);
    }

    public async fetchServers(currentUser: UserResponse): Promise<ServersResponse> {
        return fetchServers(this.twitchClient, this.dataSource, this.logger, currentUser);
    }

    public async fetchSessionUser(sessionUser: SessionUser | undefined): Promise<UserResponse> {
        return fetchSessionUser(this.dataSource, sessionUser);
    }

    public getSessionRepository(): Repository<Session> {
        return this.dataSource.getRepository(Session);
    }

    public async fetchUser(id: number): Promise<User | null> {
        const user = this.dataSource.getRepository(User).findOne({
            where: { id },
        });
        return user;
    }

    public async createOrUpdateUser(accessToken: string, refreshToken: string, twitchUser: HelixUserData): Promise<SessionUser> {
        const helixUser = new HelixUser(twitchUser, this.twitchClient);

        await this.dataSource.getRepository(TwitchChannel).upsert({
            twitchId: helixUser.id,
            twitchLogin: helixUser.name,
            displayName: helixUser.displayName,
            profilePhotoUrl: helixUser.profilePictureUrl,
            twitchCreatedAt: helixUser.creationDate,
        }, ['twitchId']);

        await this.dataSource.getRepository(User).upsert({
            twitchId: helixUser.id,
            twitchAccessToken: accessToken,
            twitchRefreshToken: refreshToken,
        }, ['twitchId']);

        const twitchChannel = await this.dataSource.getRepository(TwitchChannel).findOneOrFail({
            where: { twitchId: helixUser.id },
        });

        const user = await this.dataSource.getRepository(User).findOneOrFail({
            where: { twitchId: helixUser.id },
        });
        return {
            id: user.id,
            profilePhotoUrl: twitchChannel.profilePhotoUrl,
            displayName: twitchChannel.displayName,
            twitchLogin: twitchChannel.twitchLogin,
        };
    }

    public startRefreshing(): void {
        if (this.liveRefreshTimeout || this.videoRefreshTimeout || this.videoRefreshInitialTimeout) {
            this.stopRefreshing();
        }
        this.liveRefreshTimeout = startRefreshingLive(this.twitchClient, this.dataSource, this.logger, this.liveRefreshInterval);
        // Wait half the live interval to start the video refresh to stagger them
        this.videoRefreshInitialTimeout = setTimeout(() => {
            this.videoRefreshInitialTimeout = null;
            this.videoRefreshTimeout = startRefreshingVideos(this.twitchClient, this.dataSource, this.logger, this.videoRefreshInterval);
        }, this.liveRefreshInterval / 2);
    }

    public stopRefreshing(): void {
        if (this.liveRefreshTimeout) {
            clearInterval(this.liveRefreshTimeout);
            this.liveRefreshTimeout = null;
        }
        if (this.videoRefreshTimeout) {
            clearInterval(this.videoRefreshTimeout);
            this.videoRefreshTimeout = null;
        }
        if (this.videoRefreshInitialTimeout) {
            clearTimeout(this.videoRefreshInitialTimeout);
            this.videoRefreshInitialTimeout = null;
        }
    }

    startLoggingDatabaseCounts(): void {
        if (this.databaseStatsLogTimeout) {
            this.stopLoggingDatabaseCounts();
        }
        this.logDatabaseCounts();
        this.databaseStatsLogTimeout = setInterval(() => {
            this.logDatabaseCounts();
        }, this.databaseStatsLogInterval);
    }

    stopLoggingDatabaseCounts(): void {
        if (this.databaseStatsLogTimeout) {
            clearInterval(this.databaseStatsLogTimeout);
            this.databaseStatsLogTimeout = null;
        }
    }

    async logDatabaseCounts(): Promise<void> {
        try {
            const counts: Record<string, { kind: string, count: number }> = {};
            const tables: {
                table: string;
                kind: string;
            }[] = await this.dataSource.query(`
                SELECT
                    c.relname AS "table",
                    CASE
                        WHEN c.relkind = 'm' THEN 'materialized-view'
                        WHEN c.relkind = 'p' THEN 'partition-parent-table'
                        WHEN c.relkind = 'r' AND c.relispartition = true THEN 'partition-table'
                        WHEN c.relkind = 'r' THEN 'table'
                        ELSE 'unknown'
                    END AS "kind"
                FROM pg_catalog.pg_class c
                JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                WHERE c.relkind = ANY ('{p,r,m,""}')
                AND n.nspname = 'public'
                ORDER BY 1, 2;
            `);
            for (const { table, kind } of tables) {
                const estimateResults: { estimate: string | null }[] = await this.dataSource.query(`
                    SELECT (CASE WHEN c.reltuples < 0 THEN NULL       -- never vacuumed
                                 WHEN c.relpages = 0 THEN float8 '0'  -- empty table
                                 ELSE c.reltuples / c.relpages END
                         * (pg_catalog.pg_relation_size(c.oid)
                          / pg_catalog.current_setting('block_size')::int)
                           )::bigint as estimate
                    FROM   pg_catalog.pg_class c
                    WHERE  c.oid = '${table}'::regclass;      -- schema-qualified table here
                `);
                if (estimateResults.length === 0) {
                    continue;
                }
                const sizeResults: { size: string }[] = await this.dataSource.query(`
                    SELECT pg_total_relation_size('${table}') AS size
                `);
                if (sizeResults.length === 0) {
                    continue;
                }
                const { estimate } = estimateResults[0];
                const { size } = sizeResults[0];
                let count: number;
                if (estimate === null) {
                    const exactResults: { exact: string }[] = await this.dataSource.query(`
                        SELECT count(*) AS exact FROM "${table}";
                    `);
                    if (exactResults.length === 0) {
                        continue;
                    }
                    const { exact } = exactResults[0];
                    count = Number.parseInt(exact, 10);
                } else {
                    count = Number.parseInt(estimate, 10);
                }
                counts[table] = { kind, count };
                this.logger.info(`Stats for ${table}`, {
                    event: 'database-table-stats',
                    tableStats: {
                        table,
                        kind,
                        count,
                        size,
                    },
                });
            }
            const totalSizeResults: { size: string }[] = await this.dataSource.query(`
                SELECT pg_database_size(current_database()) AS size
            `);
            this.logger.info('Total database stats', {
                event: 'database-stats',
                tableCounts: Object.fromEntries(Object.entries(counts).map(([table, d]) => [table, d.count])),
                totalCount: Object.values(counts).filter(d => d.kind !== 'partition-parent-table').reduce((sum, d) => sum + d.count, 0),
                totalSize: totalSizeResults.length > 0 ? totalSizeResults[0].size : undefined,
            });
        } catch (error) {
            this.logger.error('Failed to log database stats', { error });
        }
    }

    startDatabasePartitionMaintenance(): void {
        if (this.databasePartitionMaintenanceTimeout) {
            this.stopDatabasePartitionMaintenance();
        }
        this.runDatabasePartitionMaintenance();
        this.databasePartitionMaintenanceTimeout = setInterval(() => {
            this.runDatabasePartitionMaintenance();
        }, this.databasePartitionMaintenanceInterval);
    }

    stopDatabasePartitionMaintenance(): void {
        if (this.databasePartitionMaintenanceTimeout) {
            clearInterval(this.databasePartitionMaintenanceTimeout);
            this.databasePartitionMaintenanceTimeout = null;
        }
    }

    async runDatabasePartitionMaintenance(): Promise<void> {
        try {
            const results = await this.dataSource.query('SELECT run_maintenance()');
            this.logger.info('Running database partition maintenance', {
                event: 'database-partition-maintenance',
                results,
            });
        } catch (error) {
            this.logger.error('Failed to perform database partition maintenance', {
                error,
            });
        }
    }
}

export default Api;
