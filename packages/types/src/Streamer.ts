import Stream from './Stream';

export default interface Streamer {
    twitchId: string;
    twitchLogin: string;
    displayName: string;
    profilePhotoUrl: string;
    liveInfo?: Stream;
}
