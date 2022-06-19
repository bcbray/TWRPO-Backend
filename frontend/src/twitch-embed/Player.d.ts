export interface Player {
    disableCaptions(): void;
    enableCaptions(): void;
    pause(): void;
    play(): void;
    seek(timestamp: number): void;
    setChannel(channel: string): void;
    setCollection(collectionId: string, videoId?: string): void;
    setQuality(quality: string): void;
    setVideo(videoId: String, timestamp: string): void;

    getMuted(): boolean;
    setMuted(muted: boolean): void;
    getVolume(): number;
    setVolume(volume: number): void;

    getPlaybackStats(): PlaybackStats;
    getChannel(): string | undefined;
    getCurrentTime(): number | undefined;
    getDuration(): number | undefined;
    getEnded(): boolean;
    getQualities(): string[];
    getQuality(): string;
    getVideo(): string | undefined;
    isPaused(): boolean;

    addEventListener(event: string, callback: () => void): void;
    removeEventListener(event: string, callback: () => void): void;
}
