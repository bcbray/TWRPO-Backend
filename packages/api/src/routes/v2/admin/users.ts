import { Router } from 'express';
import { DataSource } from 'typeorm';
import { User as UserResponse } from '@twrpo/types';

import { User } from '../../../db/entity/User';
import { SessionUser } from '../../../SessionUser';

export const fetchUser = async (dataSource: DataSource, id: number): Promise<UserResponse | null> => {
    const user = await dataSource
        .getRepository(User)
        .findOne({
            where: { id },
            relations: { channel: true },
        });

    if (!user) {
        return null;
    }
    return {
        id: user.id,
        twitchId: user.channel.twitchId,
        twitchLogin: user.channel.twitchLogin,
        displayName: user.channel.twitchLogin,
        profilePhotoUrl: user.channel.profilePhotoUrl,
        globalRole: user.globalRole,
    };
};

const buildRouter = (dataSource: DataSource): Router => {
    const router = Router();

    router.get('/me', async (req, res) => {
        if (!req.user) {
            return res.status(404).send({ success: false, errors: [{ message: 'Not logged in' }] });
        }
        const sessionUser: SessionUser = req.user as any;
        const user = await fetchUser(dataSource, sessionUser.id);
        if (!user) {
            return res.status(404).send({ success: false, errors: [{ message: 'Not logged in.' }] });
        }
        return res.send(user);
    });

    return router;
};

export default buildRouter;
