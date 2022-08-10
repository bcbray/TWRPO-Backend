import express, { Router } from 'express';
import cors from 'cors';
import { ApiClient } from 'twitch';
import { AuthProvider } from 'twitch-auth';

import { getWrpLive, Live, startRefreshing, IntervalTimeout } from './routes/live/liveData';
import { fetchCharacters, CharactersResponse } from './routes/v2/characters';
import routes from './routes';

interface ApiOptions {
    twitchAuthProvider: AuthProvider;
    refreshInterval?: number;
}

class Api {
    twitchClient: ApiClient;

    apiRouter: Router;

    private refreshInterval: number;

    private refreshTimeout: IntervalTimeout | null;

    constructor(options: ApiOptions) {
        this.twitchClient = new ApiClient({
            authProvider: options.twitchAuthProvider,
        });

        this.apiRouter = Router();
        this.apiRouter.use(cors());
        this.apiRouter.use(express.json());
        this.apiRouter.use('/v1/live', routes.liveRouter(this.twitchClient));
        this.apiRouter.use('/v2/characters', routes.v2CharactersRouter(this.twitchClient));
        this.apiRouter.use('/v2/submit-feedback', routes.v2FeedbackRouter);

        const { refreshInterval = 1000 * 60 } = options;
        this.refreshInterval = refreshInterval;
    }

    public async fetchLive(): Promise<Live> {
        return getWrpLive(this.twitchClient);
    }

    public async fetchCharacters(): Promise<CharactersResponse> {
        return fetchCharacters(this.twitchClient);
    }

    public startRefreshing(): void {
        if (this.refreshTimeout) {
            this.stopRefreshing();
        }
        this.refreshTimeout = startRefreshing(this.twitchClient, this.refreshInterval);
    }

    public stopRefreshing(): void {
        if (!this.refreshTimeout) return;
        clearInterval(this.refreshTimeout);
        this.refreshTimeout = null;
    }
}

export default Api;
