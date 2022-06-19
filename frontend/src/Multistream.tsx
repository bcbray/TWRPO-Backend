import React from 'react';
import { Stream, FactionKey, FactionInfo } from './types';
import TwitchEmbed from './TwitchEmbed';
import CharacterCard from './CharacterCard';

interface Props {
  streams: Stream[];
  factionInfoMap: Record<FactionKey, FactionInfo>;
  onClickRemove: (stream: Stream) => void;
}

const Multistream: React.FunctionComponent<Props> = ({ streams, factionInfoMap, onClickRemove }) => {
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
    width: window.innerWidth
  });

  React.useEffect(() => {
    function listener() {
      const element = document.getElementById('multistream-primary-container');
      if (!element) return;
      setDimensions({
        height: window.innerHeight - element.offsetTop,
        width: element.clientWidth
      });
    };
    listener();
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);

  const count = streams.length;
  const gap = 4;

  let bestHeight = 0;
  let bestWidth = 0;
  let ratio = 16/9;
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

  return (
    <div
      id='multistream-primary-container'
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        gap: gap,
        margin: '0 calc(50% - 50vw)',
        height: `${dimensions.height}px`,
      }}
    >
      {streams.map(stream =>
        (
          <CharacterCard
            key={stream.channelName}
            focused={listeningTo?.channelName === stream.channelName}
            onClickFocus={() => toggleFocus(stream)}
            onClickRemove={() => onClickRemove(stream)}
            stream={stream}
            factionInfo={stream.tagFaction ? factionInfoMap[stream.tagFaction] : undefined}
          >
            <TwitchEmbed
              key={stream.channelName}
              id={`${stream.channelName.toLowerCase()}-twitch-embed`}
              channel={stream.channelName}
              width={bestWidth}
              height={bestHeight}
              parent={process.env.REACT_APP_APPLICATION_HOST || 'twrponly.tv'}
              muted={listeningTo?.channelName !== stream.channelName}
            />
          </CharacterCard>
        )
      )}
    </div>
  );
};

export default Multistream;
