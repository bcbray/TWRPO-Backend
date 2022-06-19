import { Player } from './Player';
import { TwitchPlayerOptions } from './TwitchPlayerOptions'

export class TwitchPlayer {
  private player: Player

  private constructor(player: Player) {
    this.player = player;
  }

  public static FromPlayer(player: Player): TwitchPlayer {
    return new this(player);
  }

  public static FromOptions(divId: string, options: TwitchPlayerOptions): TwitchPlayer {
    if ((window as any).Twitch && (window as any).Twitch.Player) {
      return new this(new (window as any).Twitch.Player(divId, options));
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
}
