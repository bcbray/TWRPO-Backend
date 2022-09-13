import UserRole from './UserRole';

export default interface User {
    id: number;
    twitchId: string;
    twitchLogin: string;
    displayName: string;
    profilePhotoUrl: string;
    globalRole: UserRole;
}
