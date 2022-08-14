import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import isMobile from 'is-mobile';
import { Stream, CharacterInfo, FactionInfo } from '@twrpo/types';

import styles from './StreamList.module.css';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';
import { classes } from './utils';

type SortBy = 'viewers' | 'duration' | 'channel';
type Order = 'asc' | 'desc';

interface Props {
  streams: Stream[];
  offlineCharacters?: CharacterInfo[]
  factionInfos: {[key: string]: FactionInfo};
  loadTick: number;
  sort?: SortBy;
  order?: Order;
}

const StreamList: React.FC<Props> = ({
  streams,
  offlineCharacters,
  factionInfos,
  loadTick,
  sort = 'viewers',
  order = 'desc',
}) => {
  const sorted = React.useMemo(() => {
    return streams
      .sort((s1, s2) => {
        const channelCompare = s1.channelName.localeCompare(s2.channelName);
        const viewerCompare = s1.viewers === s2.viewers ? 0 : s1.viewers < s2.viewers ? -1 : 1;
        const startDateCompare = s2.startDate.localeCompare(s1.startDate);

        const orderMultiplier = order === 'asc' ? 1 : -1;
        if (sort === 'viewers') {
          return (viewerCompare || channelCompare || startDateCompare) * orderMultiplier;
        } else if (sort === 'channel') {
          return (channelCompare || viewerCompare || startDateCompare) * orderMultiplier;
        } else {
          return (startDateCompare || viewerCompare || channelCompare) * orderMultiplier;
        }
      });
  }, [streams, sort, order]);

  return (
    <Flipper flipKey={loadTick}>
      <div className={classes('inset', styles.grid)}>
        <div className={classes(styles.items)}>
          {sorted.map(stream => (
            <Flipped key={stream.channelName} flipId={stream.channelName}>
              <div>
                <StreamCard
                  stream={stream}
                  factionInfos={factionInfos}
                  loadTick={loadTick}
                  embed={isMobile() ? false : 'hover'}
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
