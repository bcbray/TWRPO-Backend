import React from 'react';

import { TwitchPlayer } from './twitch-embed'

interface Props {
    id: string;
    className?: string;
    channel: string;
    width: number | string;
    height: number | string;
    parent: string;
    muted?: boolean;
    controls?: boolean;
    autoplay?: boolean;
    play?: boolean;
    onPlaying?: (playing: boolean) => void;
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

const TwitchEmbed: React.FunctionComponent<Props> = ({
  id,
  className,
  channel,
  width,
  height,
  parent,
  muted,
  controls,
  play,
  autoplay = true,
  onPlaying,
}) => {
  const [player, setPlayer] = React.useState<TwitchPlayer | undefined>(undefined);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  const [actuallyPlaying, setActuallyPlaying] = React.useState(false);

  React.useEffect(() => {
    if (isPlayerReady) {
      player?.setMuted(muted ?? false);
    }
  }, [player, isPlayerReady, muted]);

  React.useEffect(() => {
    if (!isPlayerReady) {
      return;
    }
    if (!actuallyPlaying && play) {
      player?.play();
    } else if (actuallyPlaying && !play) {
      player?.pause();
    }
  }, [player, actuallyPlaying, play, isPlayerReady]);

  React.useEffect(() => {
    function ready() {
      setIsPlayerReady(true);
    }
    function pause() {
      setActuallyPlaying(false);
      onPlaying?.(false);
    }
    function playing() {
      setActuallyPlaying(true);
      onPlaying?.(true);
    }

    player?.addReadyListener(ready);
    player?.addPauseListener(pause);
    player?.addPlayingListener(playing);
    return () => {
      player?.removeReadyListener(ready);
      player?.removePauseListener(pause);
      player?.removePlayingListener(playing);
    }
  }, [player, onPlaying]);

  React.useEffect(() => {
    function createPlayer() {
      const player = TwitchPlayer.FromOptions(id, {
        channel,
        parent: [parent],
        width: '100%',
        height: '100%',
        muted: muted ?? false,
        autoplay: autoplay,
        controls,
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
// explicitly ignore "muted" and "playing" as they're handled in another hook
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, id, parent]);

  const styleWidth = typeof width === 'number' ? `${width}px` : width;
  const styleHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      id={id}
      className={className}
      style={{
        width: styleWidth,
        height: styleHeight,
      }}
    />
  );
};

export default TwitchEmbed;
