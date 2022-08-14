import React from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';
import { Stream, FactionKey, FactionInfo } from '@twrpo/types';

import styles from './Multistream.module.css';
import TwitchEmbed from './TwitchEmbed';
import CharacterCard from './CharacterCard';
import { PlayBtnFill } from 'react-bootstrap-icons';

interface Props {
  streams: Stream[];
  factionInfoMap: Record<FactionKey, FactionInfo>;
  onClickRemove: (stream: Stream) => void;
}

interface BestSizeOptions {
  gap?: number;
  aspectRatio?: number;
  smallBreakpoint?: number;
  fallback?: BestSize;
}

interface BestSize {
  width: number;
  height: number;
  totalHeight: number;
  overlayHeight: number;
  overlayTop: number;
}

export type BestSizeRef<E extends HTMLElement = HTMLElement> = (element: E) => void;

export type BestSizeResult<E extends HTMLElement = HTMLElement> = [BestSizeRef<E>, BestSize];

const isBrowser = typeof window !== 'undefined';

function useBestSize<E extends HTMLElement = HTMLElement>(count: number, options: BestSizeOptions = {}): BestSizeResult<E> {
  const { gap = 4 , aspectRatio = 16/9, smallBreakpoint = 514, fallback } = options;
  const [element, ref] = React.useState<E | null>(null);

  const [result, setResult] = React.useState<BestSize>(fallback ?? {
    height: 248,
    width: 440,
    totalHeight: 248 * count,
    overlayHeight: 248 * count,
    overlayTop: 0,
  })

  interface Dimensions {
    height: number;
    width: number;
    offsetTop: number;
    windowHeight: number;
  }

  const compute = React.useCallback((dimensions: Dimensions) => {
    let bestHeight = 0;
    let bestWidth = 0;
    let totalHeight = dimensions.height;

    if (dimensions.width > smallBreakpoint) {
      for (var perRow = 1; perRow <= count; perRow++) {
        let rowCount = Math.ceil(count / perRow);
        let width = (dimensions.width - gap * (perRow - 1)) / perRow;
        let height = (dimensions.height -  gap * (rowCount - 1)) / rowCount;
        if ((width / aspectRatio) < height) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }
        if (width > bestWidth) {
          bestWidth = width;
          bestHeight = height;
        }
      }
    } else {
      bestWidth = dimensions.width;
      bestHeight = bestWidth / aspectRatio;
      totalHeight = (bestHeight * count) + (gap * (count - 1));
    }

    setResult({
      width: bestWidth,
      height: bestHeight,
      totalHeight: totalHeight,
      overlayHeight: dimensions.windowHeight - dimensions.offsetTop,
      overlayTop: dimensions.offsetTop,
    });
  }, [aspectRatio, count, gap, smallBreakpoint]);

  useIsomorphicLayoutEffect(() => {
    if (isBrowser && element) {
      const handler = () => {
        compute({
          height: window.innerHeight - element.offsetTop,
          width: element.clientWidth,
          offsetTop: element.offsetTop,
          windowHeight: window.innerHeight,
        });
      };

      handler();
      window.addEventListener('resize', handler);

      return () => {
        window.removeEventListener('resize', handler);
      };
    }
    return () => {};
  }, [element, compute]);

  return [ref, result];
}

const Multistream: React.FunctionComponent<Props> = ({ streams, factionInfoMap, onClickRemove }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [listeningTo, setListeningTo] = React.useState<Stream | null>(null);
  const toggleFocus = (stream: Stream) => {
    if (listeningTo?.channelName === stream.channelName) {
      setListeningTo(null);
    } else {
      setListeningTo(stream);
    }
  };

  const gap = 4;

  const [containerRef, bestSize] = useBestSize<HTMLDivElement>(streams.length, { gap });

  const {
    width: bestWidth,
    height: bestHeight,
    totalHeight,
    overlayHeight,
    overlayTop,
  } = bestSize;

  return (
    <div
      ref={containerRef}
      className={[styles.container, isPlaying ? styles.playing : styles.paused].join(' ')}
      style={{
        height: `${totalHeight}px`,
      }}
    >
      <div
        className={styles.streamContainer}
        style={{
          gap: gap,
        }}
      >
        {streams.map(stream =>
          (
            <CharacterCard
              key={stream.channelName}
              className={styles.card}
              focused={listeningTo?.channelName === stream.channelName}
              onClickFocus={() => toggleFocus(stream)}
              onClickRemove={() => onClickRemove(stream)}
              stream={stream}
              factionInfo={stream.tagFaction ? factionInfoMap[stream.tagFaction] : undefined}
            >
              <div
                className={styles.cardContent}
                style={{
                  width: `${bestWidth}px`,
                  height: `${bestHeight}px`,
                  backgroundImage: `url(${stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')})`,
                }}
              >
                {isPlaying &&
                  <TwitchEmbed
                    id={`${stream.channelName.toLowerCase()}-twitch-embed`}
                      className='player'
                      channel={stream.channelName}
                      width={bestWidth}
                      height={bestHeight}
                      parent={process.env.REACT_APP_APPLICATION_HOST || 'twrponly.tv'}
                      muted={listeningTo?.channelName !== stream.channelName}
                  />
                }
              </div>
            </CharacterCard>
          )
        )}
      </div>
      {!isPlaying &&
        <div
          className={styles.playOverlay}
          style={{
            height: `${overlayHeight}px`,
            top: `${overlayTop}px`,
          }}
        >
          <div>
            <PlayBtnFill
              className={styles.playButton}
              width={100}
              height={100}
              fill='currentColor'
              onClick={() => setIsPlaying(true)}
            />
          </div>
        </div>
      }
    </div>
  );
};

export default Multistream;
