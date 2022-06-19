import React from 'react';
import { CharacterInfo } from './types';
import TwitchEmbed from './TwitchEmbed';
import CharacterCard from './CharacterCard';

interface Props {
  characters: CharacterInfo[];
}

const Multistream: React.FunctionComponent<Props> = ({ characters }) => {
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

  const count = characters.length;
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
      {characters.map(character =>
        (
          <CharacterCard
            key={character.channelName}
            character={character}
          >
            <TwitchEmbed
              key={character.channelName}
              id={`${character.channelName.toLowerCase()}-twitch-embed`}
              channel={character.channelName}
              width={bestWidth}
              height={bestHeight}
              parent={['twrponly.tv', 'localhost']}
              muted={true}
            />
          </CharacterCard>
        )
      )}
    </div>
  );
};

export default Multistream;
