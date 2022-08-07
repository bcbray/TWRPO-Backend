import { Player } from './Player';
import { TwitchPlayerOptions } from './TwitchPlayerOptions'
import { TwitchPlaybackStats } from './TwitchPlaybackStats'

interface EventKeys {
  CAPTIONS: string;
  ENDED: string;
  PAUSE: string;
  PLAY: string;
  PLAYBACK_BLOCKED: string;
  PLAYING: string;
  OFFLINE: string;
  ONLINE: string;
  READY: string;
  SEEK: string;
}

export class TwitchPlayer {
  private player: Player
  private eventKeys: EventKeys

  private constructor(player: Player, eventKeys: EventKeys) {
    this.player = player;
    this.eventKeys = eventKeys;
  }

  public static FromPlayer(player: Player, eventKeys: EventKeys): TwitchPlayer {
    return new this(player, eventKeys);
  }

  public static FromOptions(divId: string, options: TwitchPlayerOptions): TwitchPlayer {
    if ((window as any).Twitch && (window as any).Twitch.Player) {
      return new this(new (window as any).Twitch.Player(divId, options), (window as any).Twitch.Player);
    } else {
      throw Error('Missing the twitch embed script');
    }
  }

  public play() {
    this.player.play();
  }

  public pause() {
    this.player.pause();
  }

  public getMuted(): boolean {
    return this.player.getMuted();
  }

  public setMuted(muted: boolean): void {
    this.player.setMuted(muted);
  }

  public addReadyListener(callback: () => void): void {
    this.player.addEventListener(this.eventKeys.READY, callback);
  }

  public removeReadyListener(callback: () => void): void {
    this.player.removeEventListener(this.eventKeys.READY, callback);
  }

  public addPlayListener(callback: () => void): void {
    this.player.addEventListener(this.eventKeys.PLAY, callback);
  }

  public removePlayListener(callback: () => void): void {
    this.player.removeEventListener(this.eventKeys.PLAY, callback);
  }

  public addPauseListener(callback: () => void): void {
    this.player.addEventListener(this.eventKeys.PAUSE, callback);
  }

  public removePauseListener(callback: () => void): void {
    this.player.removeEventListener(this.eventKeys.PAUSE, callback);
  }

  public addPlayingListener(callback: () => void): void {
    this.player.addEventListener(this.eventKeys.PLAYING, callback);
  }

  public removePlayingListener(callback: () => void): void {
    this.player.removeEventListener(this.eventKeys.PLAYING, callback);
  }

  public getPlaybackStats(): TwitchPlaybackStats {
    return this.player.getPlaybackStats();
  }

  public getQualities(): string[] {
    return this.player.getQualities();
  }

  public getQuality(): string {
    return this.player.getQuality();
  }

  public setQuality(quality: string) {
    return this.player.setQuality(quality);
  }
}
