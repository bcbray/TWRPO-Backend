import React from 'react';
import { useUncontrolledProp } from 'uncontrollable';

import { TwitchPlayer } from './twitch-embed'

interface Props {
    id: string;
    className?: string;
    channel: string;
    width: number;
    height: number;
    parent: string;
    muted?: boolean;
    controls?: boolean;
    autoplay?: boolean;
    play?: boolean;
    onTogglePlay?: (nextPlay: boolean) => void;

    // Roughly equivalent to onTogglePlay,
    // but won't switch to `true` until the
    // video is actually playing (e.g. after
    // the initial buffering is complete)
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
  play: propsPlaying,
  onTogglePlay: propsOnTogglePlaying,
  autoplay = true,
  onPlaying,
}) => {
  const [player, setPlayer] = React.useState<TwitchPlayer | undefined>(undefined);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  const [actuallyPlaying, setActuallyPlaying] = React.useState(false);
  const [playing, setPlaying] = useUncontrolledProp(propsPlaying, autoplay, propsOnTogglePlaying);

  React.useEffect(() => {
    if (isPlayerReady) {
      player?.setMuted(muted ?? false);
    }
  }, [player, isPlayerReady, muted]);

  React.useEffect(() => {
    if (!isPlayerReady) {
      return;
    }
    if (!actuallyPlaying && playing) {
      player?.play();
    } else if (actuallyPlaying && !playing) {
      player?.pause();
    }
  }, [player, actuallyPlaying, playing, isPlayerReady]);

  React.useEffect(() => {
    function ready() {
      setIsPlayerReady(true);
    }
    function pause() {
      setActuallyPlaying(false);
      setPlaying(false);
      onPlaying?.(false);
    }
    function playing() {
      setActuallyPlaying(true);
      setPlaying(true);
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
  }, [player, setPlaying, onPlaying]);

  React.useEffect(() => {
    function createPlayer() {
      const player = TwitchPlayer.FromOptions(id, {
        channel,
        parent: [parent],
        width: '100%',
        height: '100%',
        muted: muted ?? false,
        autoplay: playing,
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

  return (
    <div id={id} className={className} style={{width: `${width}px`, height: `${height}px` }} />
  );
};

export default TwitchEmbed;
