import { UserResponse } from '@twrpo/types';

export const isGlobalEditor = (currentUser: UserResponse): boolean => {
    if (currentUser.user === null) {
        return false;
    }
    return currentUser.user.globalRole === 'admin' || currentUser.user.globalRole === 'editor';
};

export const isEditorForTwitchId = (twitchId: string, currentUser: UserResponse): boolean =>
    isGlobalEditor(currentUser);
