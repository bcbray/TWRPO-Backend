import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import isMobile from 'is-mobile';
import { Stream, CharacterInfo } from '@twrpo/types';

import styles from './StreamList.module.css';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';
import { classes } from './utils';
import Crossfade from './Crossfade';

type SortBy = 'viewers' | 'duration' | 'channel';
type Order = 'asc' | 'desc';

interface Props {
  streams: Stream[];
  offlineCharacters?: CharacterInfo[]
  loadTick: number;
  sort?: SortBy;
  order?: Order;
}

const StreamList: React.FC<Props> = ({
  streams,
  offlineCharacters = [],
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
            <Flipped
              key={
                stream.characterId
                  ? `char:${stream.characterId}`
                  : `chan:${stream.channelName}`
              }
              flipId={
                stream.characterId
                  ? `char:${stream.characterId}`
                  : `chan:${stream.channelName}`
              }>
              <Crossfade fadeKey='live'>
                <StreamCard
                  stream={stream}
                  loadTick={loadTick}
                  embed={isMobile() ? false : 'hover'}
                />
              </Crossfade>
            </Flipped>
          ))}
          {offlineCharacters.map(character => (
            <Flipped key={`char:${character.id}`} flipId={`char:${character.id}`}>
              <Crossfade fadeKey='offline'>
                <OfflineCharacterCard
                  className={styles.offline}
                  character={character}
                />
              </Crossfade>
            </Flipped>
          ))}
        </div>
      </div>
    </Flipper>
  );
};

export default StreamList;
