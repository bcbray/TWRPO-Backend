import React from 'react';

import styles from './Multistream.module.css';
import { Stream, FactionKey, FactionInfo } from './types';
import TwitchEmbed from './TwitchEmbed';
import CharacterCard from './CharacterCard';
import { PlayBtnFill } from 'react-bootstrap-icons';

interface Props {
  streams: Stream[];
  factionInfoMap: Record<FactionKey, FactionInfo>;
  onClickRemove: (stream: Stream) => void;
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

  // TODO: Consider moving width/height out of the react tree
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
    offsetTop: 0,
    windowHeight: window.innerHeight,
  });

  React.useEffect(() => {
    function listener() {
      const element = document.getElementById('multistream-primary-container');
      if (!element) return;
      setDimensions({
        height: window.innerHeight - element.offsetTop,
        width: element.clientWidth,
        offsetTop: element.offsetTop,
        windowHeight: window.innerHeight,
      });
    };
    listener();
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);

  const count = streams.length;
  const gap = 4;
  const smallBreakpoint = 514;

  let bestHeight = 0;
  let bestWidth = 0;
  let totalHeight = dimensions.height;
  let ratio = 16/9;

  if (dimensions.width > smallBreakpoint) {
    for (var perRow = 1; perRow <= count; perRow++) {
      let rowCount = Math.ceil(count / perRow);
      let width = (dimensions.width - gap * (perRow - 1)) / perRow;
      let height = (dimensions.height -  gap * (rowCount - 1)) / rowCount;
      if ((width / ratio) < height) {
        height = width / ratio;
      } else {
        width = height * ratio;
      }
      if (width > bestWidth) {
        bestWidth = width;
        bestHeight = height;
      }
    }
  } else {
    bestWidth = dimensions.width;
    bestHeight = bestWidth / ratio;
    totalHeight = (bestHeight * count) + (gap * (count - 1));
  }

  return (
    <div
      id='multistream-primary-container'
      className={[styles.container, isPlaying ? styles.playing : styles.paused].join(' ')}
      style={{
        height: `${totalHeight}px`,
      }}
    >
      <div
        id='multistream-primary-container'
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
            height: `${dimensions.windowHeight - dimensions.offsetTop}px`,
            top: `${dimensions.offsetTop}px`,
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
