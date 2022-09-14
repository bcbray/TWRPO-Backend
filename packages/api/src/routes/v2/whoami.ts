import { Router } from 'express';
import { DataSource } from 'typeorm';
import { UserResponse } from '@twrpo/types';

import { User } from '../../db/entity/User';
import { SessionUser } from '../../SessionUser';

export const fetchSessionUser = async (dataSource: DataSource, sessionUser: SessionUser | undefined): Promise<UserResponse | null> => {
    if (!sessionUser) {
        return { user: null };
    }
    const user = await dataSource
        .getRepository(User)
        .findOne({
            where: { id: sessionUser.id },
            relations: { channel: true },
        });

    if (!user) {
        return { user: null };
    }
    return {
        user: {
            id: user.id,
            twitchId: user.channel.twitchId,
            twitchLogin: user.channel.twitchLogin,
            displayName: user.channel.twitchLogin,
            profilePhotoUrl: user.channel.profilePhotoUrl,
            globalRole: user.globalRole,
        },
    };
};

const buildRouter = (dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const response = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
