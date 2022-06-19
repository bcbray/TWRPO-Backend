import { Player } from './Player';
import { TwitchPlayerOptions } from './TwitchPlayerOptions'

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
}
