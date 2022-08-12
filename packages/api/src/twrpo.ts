import express, { Router } from 'express';
import cors from 'cors';
import { ApiClient } from 'twitch';
import { AuthProvider } from 'twitch-auth';
import { DataSource } from 'typeorm';

import { getWrpLive, Live, startRefreshing, IntervalTimeout } from './routes/live/liveData';
import { fetchCharacters, CharactersResponse } from './routes/v2/characters';
import { fetchFactions, FactionsResponse } from './routes/v2/factions';
import routes from './routes';
import dataSource from './db/dataSource';

interface ApiOptions {
    twitchAuthProvider: AuthProvider;
    postgresUrl: string;
    refreshInterval?: number;
}

class Api {
    twitchClient: ApiClient;

    apiRouter: Router;

    private dataSource: DataSource;

    private refreshInterval: number;

    private refreshTimeout: IntervalTimeout | null;

    constructor(options: ApiOptions) {
        this.twitchClient = new ApiClient({
            authProvider: options.twitchAuthProvider,
        });
        this.dataSource = dataSource(options.postgresUrl);

        this.apiRouter = Router();
        this.apiRouter.use(cors());
        this.apiRouter.use(express.json());
        this.apiRouter.use('/v1/live', routes.liveRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/characters', routes.v2CharactersRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/factions', routes.v2FactionsRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/submit-feedback', routes.v2FeedbackRouter);

        const { refreshInterval = 1000 * 60 } = options;
        this.refreshInterval = refreshInterval;
    }

    public async initialize(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async fetchLive(): Promise<Live> {
        return getWrpLive(this.twitchClient, this.dataSource);
    }

    public async fetchFactions(): Promise<FactionsResponse> {
        return fetchFactions(this.twitchClient, this.dataSource);
    }

    public async fetchCharacters(): Promise<CharactersResponse> {
        return fetchCharacters(this.twitchClient, this.dataSource);
    }

    public startRefreshing(): void {
        if (this.refreshTimeout) {
            this.stopRefreshing();
        }
        this.refreshTimeout = startRefreshing(this.twitchClient, this.dataSource, this.refreshInterval);
    }

    public stopRefreshing(): void {
        if (!this.refreshTimeout) return;
        clearInterval(this.refreshTimeout);
        this.refreshTimeout = null;
    }
}

export default Api;
