import { UserResponse } from '@twrpo/types';

export const isGlobalAdmin = (currentUser: UserResponse): boolean => {
    if (currentUser === null) {
        return false;
    }
    return currentUser.user?.globalRole === 'admin';
};

export const isGlobalEditor = (currentUser: UserResponse): boolean => {
    if (currentUser.user === null) {
        return false;
    }
    return currentUser.user.globalRole === 'admin' || currentUser.user.globalRole === 'editor';
};

export const isEditorForTwitchId = (twitchId: string, currentUser: UserResponse): boolean =>
    isGlobalEditor(currentUser);
