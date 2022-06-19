export interface TwitchPlayerOptions {
    channel: string;
    parent: string[];
    height: number | string;
    width: number | string;

    autoplay?: boolean;
    muted?: boolean;
    time?: string;
}
