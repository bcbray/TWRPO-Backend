import React from 'react';
import { TwitchPlayer } from './twitch-embed'

interface Props{
    id: string;
    channel: string;
    width: number;
    height: number;
    parent: string[];
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

const TwitchEmbed: React.FunctionComponent<Props> = ({ id, channel, width, height, parent, muted }) => {
  const [player, setPlayer] = React.useState<TwitchPlayer | undefined>(undefined);

  React.useEffect(() => {
    player?.setMuted(muted ?? false);
  }, [player, muted]);

  React.useEffect(() => {
    function createPlayer() {
      const player = TwitchPlayer.FromOptions(id, {
        channel,
        parent,
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
      tag?.removeEventListener('load', createPlayer);
      // TODO: Figure out how to remove the script when we no longer need it across any embeds?
    }
  }, [channel, id, ...parent]); // explicitly ignore "muted" as it's handled in another hook

  return (
    <div id={id} style={{width: `${width}px`, height: `${height}px`}} />
  );
};

export default TwitchEmbed;
