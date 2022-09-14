import React from 'react';
import { Flipper, Flipped } from 'react-flip-toolkit';
import isMobile from 'is-mobile';
import { Stream, CharacterInfo, Streamer, VideoSegment } from '@twrpo/types';

import styles from './StreamList.module.css';
import StreamCard from './StreamCard';
import VideoSegmentCard from './VideoSegmentCard';
import OfflineCharacterCard from './OfflineCharacterCard';
import { classes } from './utils';
import Crossfade from './Crossfade';
import { usePaginated } from './hooks';
import Spinner from './Spinner';

type SortBy = 'viewers' | 'duration' | 'channel';
type Order = 'asc' | 'desc';

interface Props {
  streams: Stream[];
  segments?: [Streamer, VideoSegment][];
  offlineCharacters?: CharacterInfo[];
  isLoadingMore?: boolean;
  paginationKey: string;
  loadTick: number;
  sort?: SortBy;
  order?: Order;
  hideStreamer?: boolean;
  noInset?: boolean;
  wrapTitle?: boolean;
  showLiveBadge?: boolean;
  dimPastStreams?: boolean;
}

interface LiveItem {
  type: 'live';
  stream: Stream;
}

interface SegmentItem {
  type: 'segment';
  streamer: Streamer;
  segment: VideoSegment;
}

interface OfflineItem {
  type: 'offline';
  character: CharacterInfo;
}

const liveItem = (stream: Stream): LiveItem => ({ type: 'live', stream });
const segmentItem = (streamer: Streamer, segment: VideoSegment): SegmentItem => ({ type: 'segment', streamer, segment });
const offlineItem = (character: CharacterInfo): OfflineItem => ({ type: 'offline', character });

const StreamList: React.FC<Props> = ({
  streams,
  segments = [],
  offlineCharacters = [],
  isLoadingMore = false,
  loadTick,
  paginationKey,
  sort = 'viewers',
  order = 'desc',
  hideStreamer = false,
  noInset = false,
  wrapTitle = false,
  showLiveBadge = false,
  dimPastStreams = true,
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

  const allItems = React.useMemo(() => (
    [
      ...sorted.map(liveItem),
      ...segments.map(([streamer, segment]) => segmentItem(streamer, segment)),
      ...offlineCharacters.map(offlineItem),
    ]
  ), [sorted, segments, offlineCharacters]);

  const [visibleItems, loadMoreTrigger] = usePaginated(allItems, { key: paginationKey });

  return (
    <Flipper flipKey={loadTick}>
      <div className={classes(!noInset && 'inset', styles.grid)}>
        <div className={classes(styles.items, visibleItems.length === 0 && styles.empty)}>
          {visibleItems.map(item => {
            if (item.type === 'live') {
              const { stream } = item;
              return (
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
                      hideStreamer={hideStreamer}
                      wrapTitle={wrapTitle}
                      showLiveBadge={showLiveBadge}
                    />
                  </Crossfade>
                </Flipped>
              );
            } else if (item.type === 'segment' ) {
              const { streamer, segment } = item;
              return (
                <Flipped
                  key={`segment:${segment.id}`}
                  flipId={`segment:${segment.id}`}
                >
                  <Crossfade fadeKey='past'>
                    <VideoSegmentCard
                      streamer={streamer}
                      segment={segment}
                      loadTick={loadTick}
                      embed={isMobile() ? false : 'hover'}
                      hideStreamer={hideStreamer}
                      wrapTitle={wrapTitle}
                      canDim={dimPastStreams}
                      canShowLiveBadge={showLiveBadge}
                    />
                  </Crossfade>
                </Flipped>
              )
            } else {
              const { character } = item;
              return (
                <Flipped key={`char:${character.id}`} flipId={`char:${character.id}`}>
                  <Crossfade fadeKey='offline'>
                    <OfflineCharacterCard
                      className={styles.offline}
                      character={character}
                      hideStreamer={hideStreamer}
                      wrapTitle={wrapTitle}
                    />
                  </Crossfade>
                </Flipped>
              );
            }
          })}
          {isLoadingMore && <div className={styles.spinnerCard}><Spinner /></div>}
        </div>
        {loadMoreTrigger}
      </div>
    </Flipper>
  );
};

export default StreamList;
