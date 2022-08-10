import { Player } from './Player';
import { TwitchPlayerOptions } from './TwitchPlayerOptions'
import { TwitchPlaybackStats } from './TwitchPlaybackStats'
import { TwitchQuality } from './TwitchQuality'

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

  private _fixWindowRefIfNeeded() {
    // When iframes move around the page, it's occasionally the case that the player
    // loses track of the contentWindow ref. This tried to safely dig in to the
    // underlying player and fix if up when things are out of sync.

    if (!('_iframe' in this.player)) {
      console.warn('_iframe is not on player', this.player);
      return;
    }

    if (!((this.player as any)._iframe instanceof HTMLIFrameElement)) {
      console.warn('_iframe is not an iframe on player', this.player);
      return;
    }

    if (!('_player' in this.player)) {
      console.warn('_player is not on player', this.player);
      return;
    }

    if (!((this.player as any)._player instanceof Object)) {
      console.warn('_player is not an object on player', this.player);
      return;
    }

    const iframe = (this.player as any)._iframe as HTMLIFrameElement;

    const privatePlayer = ((this.player as any)._player) as Object;

    if (!('_embedWindow' in privatePlayer)) {
      console.warn('_embedWindow is not on _player', privatePlayer);
      return;
    }

    const embedWindow = (privatePlayer as any)._embedWindow as Window | undefined;

    if (!('_setWindowRef' in privatePlayer)) {
      console.warn('_setWindowRef is not on _player', privatePlayer);
      return;
    }

    if (!(typeof (privatePlayer as any)._setWindowRef == 'function')) {
      console.warn('_setWindowRef is not a function on _player', privatePlayer);
      return;
    }

    if (iframe.contentWindow !== embedWindow) {
      console.log('Fixing player window ref');
      (privatePlayer as any)._setWindowRef(iframe.contentWindow);
    }
  }

  public play() {
    this._fixWindowRefIfNeeded();
    this.player.play();
  }

  public pause() {
    this._fixWindowRefIfNeeded();
    this.player.pause();
  }

  public getMuted(): boolean {
    this._fixWindowRefIfNeeded();
    return this.player.getMuted();
  }

  public setMuted(muted: boolean): void {
    this._fixWindowRefIfNeeded();
    this.player.setMuted(muted);
  }

  public addReadyListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.addEventListener(this.eventKeys.READY, callback);
  }

  public removeReadyListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.removeEventListener(this.eventKeys.READY, callback);
  }

  public addPlayListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.addEventListener(this.eventKeys.PLAY, callback);
  }

  public removePlayListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.removeEventListener(this.eventKeys.PLAY, callback);
  }

  public addPauseListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.addEventListener(this.eventKeys.PAUSE, callback);
  }

  public removePauseListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.removeEventListener(this.eventKeys.PAUSE, callback);
  }

  public addPlayingListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.addEventListener(this.eventKeys.PLAYING, callback);
  }

  public removePlayingListener(callback: () => void): void {
    this._fixWindowRefIfNeeded();
    this.player.removeEventListener(this.eventKeys.PLAYING, callback);
  }

  public getPlaybackStats(): TwitchPlaybackStats {
    this._fixWindowRefIfNeeded();
    return this.player.getPlaybackStats();
  }

  public getQualities(): TwitchQuality[] {
    this._fixWindowRefIfNeeded();
    return this.player.getQualities();
  }

  public getQuality(): string {
    this._fixWindowRefIfNeeded();
    return this.player.getQuality();
  }

  public setQuality(quality: string) {
    this._fixWindowRefIfNeeded();
    return this.player.setQuality(quality);
  }
}
