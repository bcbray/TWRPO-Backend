import Stream from './Stream';

export default interface Streamer {
    twitchId: string;
    twitchLogin: string;
    displayName: string;
    profilePhotoUrl: string;
    liveInfo?: Stream;
    /** Average time (in seconds from midnight, UTC) of known stream’s starting */
    averageStreamStartTimeOffset?: number;
}
