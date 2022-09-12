import express, { Router } from 'express';
import cors from 'cors';
import { ApiClient } from '@twurple/api';
import { AuthProvider } from '@twurple/auth';
import { DataSource } from 'typeorm';
import {
    CharactersResponse,
    FactionsResponse,
    LiveResponse,
    StreamerResponse,
    StreamersResponse,
} from '@twrpo/types';

import { getWrpLive, startRefreshing as startRefreshingLive, IntervalTimeout } from './routes/live/liveData';
import { fetchCharacters } from './routes/v2/characters';
import { fetchFactions } from './routes/v2/factions';
import { fetchStreamer, fetchStreamers } from './routes/v2/streamers';
import routes from './routes';
import dataSource from './db/dataSource';
import { startRefreshing as startRefreshingVideos } from './fetchVideos';

interface ApiOptions {
    twitchAuthProvider: AuthProvider;
    postgresUrl: string;
    liveRefreshInterval?: number;
    videoRefreshInterval?: number;
}

class Api {
    twitchClient: ApiClient;

    apiRouter: Router;

    private dataSource: DataSource;

    private liveRefreshInterval: number;

    private liveRefreshTimeout: IntervalTimeout | null;

    private videoRefreshInterval: number;

    private videoRefreshInitialTimeout: IntervalTimeout | null;

    private videoRefreshTimeout: IntervalTimeout | null;

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
        this.apiRouter.use('/v2/streamers', routes.v2StreamersRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/submit-feedback', routes.v2FeedbackRouter);

        const { liveRefreshInterval = 1000 * 60 } = options;
        this.liveRefreshInterval = liveRefreshInterval;

        const { videoRefreshInterval = 1000 * 60 * 10 } = options;
        this.videoRefreshInterval = videoRefreshInterval;
    }

    public async initialize(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async fetchLive(): Promise<LiveResponse> {
        return getWrpLive(this.twitchClient, this.dataSource);
    }

    public async fetchFactions(): Promise<FactionsResponse> {
        return fetchFactions(this.twitchClient, this.dataSource);
    }

    public async fetchCharacters(): Promise<CharactersResponse> {
        return fetchCharacters(this.twitchClient, this.dataSource);
    }

    public async fetchStreamer(name: string): Promise<StreamerResponse | null> {
        return fetchStreamer(this.twitchClient, this.dataSource, name);
    }

    public async fetchStreamers(): Promise<StreamersResponse> {
        return fetchStreamers(this.twitchClient, this.dataSource);
    }

    public startRefreshing(): void {
        if (this.liveRefreshTimeout || this.videoRefreshTimeout || this.videoRefreshInitialTimeout) {
            this.stopRefreshing();
        }
        this.liveRefreshTimeout = startRefreshingLive(this.twitchClient, this.dataSource, this.liveRefreshInterval);
        // Wait half the live interval to start the video refresh to stagger them
        this.videoRefreshInitialTimeout = setTimeout(() => {
            this.videoRefreshInitialTimeout = null;
            this.videoRefreshTimeout = startRefreshingVideos(this.twitchClient, this.dataSource, this.videoRefreshInterval);
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
}

export default Api;
