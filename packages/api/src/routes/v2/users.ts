import { Router } from 'express';
import { DataSource } from 'typeorm';
import { UserResponse, UsersResponse } from '@twrpo/types';

import { User } from '../../db/entity/User';
import { SessionUser } from '../../SessionUser';
import { fetchSessionUser } from './whoami';
import { isGlobalAdmin } from '../../userUtils';

export const fetchUsers = async (dataSource: DataSource, currentUser: UserResponse): Promise<UsersResponse | null> => {
    if (!currentUser.user) {
        return { users: [] };
    }

    if (!isGlobalAdmin(currentUser)) {
        return { users: [currentUser.user] };
    }

    const users = await dataSource
        .getRepository(User)
        .find({
            order: { createdAt: 'desc' },
            relations: { channel: true },
        });

    return {
        users: users.map(user => ({
            id: user.id,
            twitchId: user.channel.twitchId,
            twitchLogin: user.channel.twitchLogin,
            displayName: user.channel.twitchLogin,
            profilePhotoUrl: user.channel.profilePhotoUrl,
            globalRole: user.globalRole,
        })),
    };
};

const buildRouter = (dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const currentUser = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchUsers(dataSource, currentUser);
        if (!response) {
            return res
                .status(403)
                .send({ success: false, errors: [{ message: 'Unauthorized' }] });
        }
        return res.send(response);
    });

    return router;
};

export default buildRouter;
