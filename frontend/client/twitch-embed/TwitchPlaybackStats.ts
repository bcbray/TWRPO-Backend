export interface TwitchPlaybackStats {
    backendVersion: string;
    bufferSize: number;
    codecs: string;
    displayResolution: string;
    fps: number;
    hlsLatencyBroadcaster: number;
    playbackRate: number;
    skippedFrames: number;
    videoResolution: string;
}
