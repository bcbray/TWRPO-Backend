import { UserResponse } from '@twrpo/types';

export const isEditorForTwitchId = (twitchId: string, currentUser: UserResponse) => {
    if (currentUser.user === null) {
        return false;
    }
    return currentUser.user.globalRole === 'admin' || currentUser.user.globalRole === 'editor';
};
