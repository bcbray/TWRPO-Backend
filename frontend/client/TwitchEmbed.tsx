import React from 'react';

import { TwitchPlayer, TwitchQuality } from './twitch-embed'
import { useMeasure } from 'react-use';
import { useDevicePixelRatio } from './hooks';

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
  play: propsPlay,
  autoplay = true,
  onPlaying,
}) => {
  const [player, setPlayer] = React.useState<TwitchPlayer | undefined>(undefined);
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);
  const [actuallyPlaying, setActuallyPlaying] = React.useState(false);
  const [ref, measure] = useMeasure<HTMLDivElement>();
  const scale = useDevicePixelRatio();
  const [qualities, setQualities] = React.useState<TwitchQuality[]>([]);
  const [targetQuality, setTargetQuality] = React.useState<TwitchQuality | undefined>(undefined);

  const play = propsPlay !== undefined ? propsPlay : autoplay;

  React.useEffect(() => {
    if (!isPlayerReady) {
      return;
    }
    if (!targetQuality) {
      return;
    }
    if (controls) {
      return;
    }
    if (player?.getQuality() !== targetQuality.group) {
      player?.setQuality(targetQuality.group);
    }
  }, [targetQuality, isPlayerReady, player, controls]);

  React.useEffect(() => {
    // Only auto-quality if controls are hidden (otherwise, let people manage their own quality)
    if (controls) {
      return;
    }
    let defaultQuality: TwitchQuality | undefined = undefined;
    let targetQuality: TwitchQuality | undefined = undefined;
    for (const quality of qualities) {
      if (quality.isDefault) {
        defaultQuality = quality;
        // Once we find the default quality, if we have no height we can stop looping
        if (measure.height === 0) {
          break;
        }
      }
      if (measure.height === 0 || quality.height < measure.height * scale) continue;
      if (targetQuality === undefined || quality.height < targetQuality.height) {
        targetQuality = quality;
      }
    }
    setTargetQuality(targetQuality ?? defaultQuality);
  }, [scale, measure.height, qualities, controls]);

  //const [play, setPlay] = useUncontrolledProp(propsPlaying, autoplay, propsOnTogglePlaying);

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
      setActuallyPlaying(false);
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
      if (!player) return;
      setQualities(player.getQualities());
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
      ref={ref}
      className={className}
      style={{
        width: styleWidth,
        height: styleHeight,
      }}
    />
  );
};

export default TwitchEmbed;
