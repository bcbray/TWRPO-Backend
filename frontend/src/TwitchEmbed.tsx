import React from 'react';
import { TwitchPlayer } from './twitch-embed'

interface Props {
    id: string;
    className?: string;
    channel: string;
    width: number;
    height: number;
    parent: string;
    muted?: boolean;
}

function addScript(): HTMLScriptElement {
  const existing = document.getElementById('twitch_embed_script') as HTMLScriptElement;
  if (existing) {
    return existing;
  }
  const scriptElement = document.createElement('script');
  scriptElement.setAttribute('id', 'twitch_embed_script');
  scriptElement.setAttribute('type', 'text/javascript');
  scriptElement.setAttribute('src', 'https://player.twitch.tv/js/embed/v1.js');
  document.body.appendChild(scriptElement);
  return scriptElement;
};

const TwitchEmbed: React.FunctionComponent<Props> = ({ id, className, channel, width, height, parent, muted }) => {
  const [player, setPlayer] = React.useState<TwitchPlayer | undefined>(undefined);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);

  React.useEffect(() => {
    if (isPlayerReady) {
      player?.setMuted(muted ?? false);
    }
  }, [player, isPlayerReady, muted]);

  React.useEffect(() => {
    function ready() {
      setIsPlayerReady(true);
    }

    player?.addReadyListener(ready);
    return () => {
      player?.removeReadyListener(ready);
    }
  }, [player]);

  React.useEffect(() => {
    function createPlayer() {
      const player = TwitchPlayer.FromOptions(id, {
        channel,
        parent: [parent],
        width: '100%',
        height: '100%',
        muted: muted ?? false,
        autoplay: true,
      });
      setPlayer(player);
    }

    let tag: HTMLScriptElement | undefined = undefined;
    if ((window as any).Twitch && (window as any).Twitch.Player) {
      createPlayer();
    } else {
      tag = addScript();
      tag.addEventListener('load', createPlayer);
    }
    return () => {
      const div = document.getElementById(id);
      if (div) {
        div.innerHTML = '';
      }
      setPlayer(undefined);
      setIsPlayerReady(false);
      tag?.removeEventListener('load', createPlayer);
      // TODO: Figure out how to remove the script when we no longer need it across any embeds?
    }
// explicitly ignore "muted" as it's handled in another hook
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, id, parent]);

  return (
    <div id={id} className={className} style={{width: `${width}px`, height: `${height}px` }} />
  );
};

export default TwitchEmbed;
