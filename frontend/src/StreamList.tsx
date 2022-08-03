import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';

import styles from './StreamList.module.css';
import { Stream, CharacterInfo, FactionInfo } from './types';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';
import { classes } from './utils';

interface Props {
  streams: Stream[];
  offlineCharacters?: CharacterInfo[]
  factionInfos: {[key: string]: FactionInfo};
  loadTick: number;
}

const StreamList: React.FC<Props> = ({ streams, offlineCharacters, factionInfos, loadTick }) => {
  return (
    <Flipper flipKey={loadTick}>
      <div className={classes('inset', styles.grid)}>
        <div className={classes(styles.items)}>
          {streams.map(stream => (
            <Flipped key={stream.channelName} flipId={stream.channelName}>
              <div>
                <StreamCard
                  stream={stream}
                  factionInfos={factionInfos}
                  loadTick={loadTick}
                />
              </div>
            </Flipped>
          ))}
          {offlineCharacters && offlineCharacters.map(character => (
            <div key={`${character.channelName}_${character.name}`}>
              <OfflineCharacterCard
                className={styles.offline}
                character={character}
                factionInfos={factionInfos}
              />
            </div>
          ))}
        </div>
      </div>
    </Flipper>
  );
};

export default StreamList;
