import express, { Router } from 'express';
import cors from 'cors';
import { ApiClient, HelixUser, HelixUserData } from '@twurple/api';
import { AuthProvider } from '@twurple/auth';
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
} from '@twrpo/types';

import { getWrpLive, startRefreshing as startRefreshingLive, IntervalTimeout } from './routes/live/liveData';
import { fetchCharacters } from './routes/v2/characters';
import { fetchFactions } from './routes/v2/factions';
import { fetchStreamer, fetchStreamers } from './routes/v2/streamers';
import { fetchUnknown } from './routes/v2/unknown';
import { fetchSegment } from './routes/v2/segments';
import { fetchSessionUser } from './routes/v2/whoami';
import routes from './routes';
import dataSource from './db/dataSource';
import { SessionUser } from './SessionUser';
import { Session } from './db/entity/Session';
import { User } from './db/entity/User';
import { TwitchChannel } from './db/entity/TwitchChannel';
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
        this.apiRouter.use('/v2/unknown', routes.v2UnknownRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/segments', routes.v2SegmentsRouter(this.twitchClient, this.dataSource));
        this.apiRouter.use('/v2/whoami', routes.v2WhoamiRouter(this.dataSource));
        this.apiRouter.use('/v2/submit-feedback', routes.v2FeedbackRouter);
        this.apiRouter.use('/v2/admin/override-segment', routes.v2AdminOverrideSegmentRouter(this.twitchClient, this.dataSource));

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

    public async fetchUnknown(): Promise<UnknownResponse> {
        return fetchUnknown(this.twitchClient, this.dataSource);
    }

    public async fetchSegment(id: number): Promise<VideoSegment | null> {
        return fetchSegment(this.twitchClient, this.dataSource, id);
    }

    public async fetchSessionUser(sessionUser: SessionUser | undefined): Promise<UserResponse | null> {
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
