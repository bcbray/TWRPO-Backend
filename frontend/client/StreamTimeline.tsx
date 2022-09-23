import React from 'react';
import {
  Interval,
  startOfDay,
  endOfDay,
  addDays,
  areIntervalsOverlapping,
  isWithinInterval,
  toDate,
} from 'date-fns';
import { Link } from 'react-router-dom';
import { useDeepCompareEffect, useLocalStorage } from 'react-use';
import { Button } from '@restart/ui';
import { SegmentAndStreamer } from '@twrpo/types';

import styles from './StreamTimeline.module.css';

import { useStreams, useNow, useIsFirstRenderFromSSR } from './Data';
import { usePaginatedStreams } from './Streams';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import { useShortDate } from './hooks';
import Loading from './Loading';
import { useFactionCss } from './FactionStyleProvider';
import Timeline from './Timeline'

interface StreamTimelineProps {
}

const useDay = (date: Date): Interval => React.useMemo(() => ({
  start: startOfDay(date),
  end: endOfDay(date),
}), [date]);

const useIntervalStreams = (interval: Interval): {
  streams: SegmentAndStreamer[],
  lastRefresh: Date | null,
  hasMore: Boolean,
  reload: () => void,
} => {
  const {
    streams,
    lastRefresh,
    hasMore,
    loadMore,
    reload,
  } = usePaginatedStreams(useStreams, {
    distinctCharacters: false,
    endAfter: toDate(interval.start),
    startBefore: toDate(interval.end),
    limit: 100,
  }, {
    skipsPreload: true,
  });
  const [isComplete, setIsComplete] = React.useState(true);

  React.useEffect(() => {
    if (!hasMore) {
      setIsComplete(true);
      return;
    }
    loadMore();
  }, [streams, loadMore, hasMore]);

  useDeepCompareEffect(() => {
    setIsComplete(false);
    reload();
  }, [interval.start, interval.end]);

  const loadedStreams = React.useMemo(() => isComplete ? streams : [], [isComplete, streams]);

  const overlappingStreams = React.useMemo(() => (
    loadedStreams.filter(({ segment }) => {
      const start = new Date(segment.startDate);
      const end = new Date(segment.endDate);
      return areIntervalsOverlapping(interval, { start, end });
    })
  ), [loadedStreams, interval]);

  const ourReload = React.useCallback(() => {
    setIsComplete(false);
    reload();
  }, [reload]);

  return {
    streams: overlappingStreams,
    lastRefresh: lastRefresh ?? null,
    hasMore,
    reload: ourReload,
  };
}

const DayHeader: React.FC<{ date: Date, className?: string }> = ({ date, className }) => {
  const formattedDate = useShortDate(date);
  return <h3 className={className}>{formattedDate}</h3>
}

const StreamTimeline: React.FC<StreamTimelineProps> = () => {
  const now = useNow();
  const [offset, setOffset] = React.useState(0);
  const target = React.useMemo(() => addDays(now, offset), [now, offset])
  const day = useDay(target);
  const { streams, lastRefresh, hasMore, reload } = useIntervalStreams(day);
  const isFirstRender = useIsFirstRenderFromSSR();
  const isToday = React.useMemo(() => !isFirstRender && isWithinInterval(now, day), [isFirstRender, now, day]);
  const [isCompact, setIsCompact] = useLocalStorage('timeline-compact', false);
  const { factionStylesForKey } = useFactionCss();

  const previous = React.useCallback(() => {
    setOffset(o => o - 1);
  }, []);

  const next = React.useCallback(() => {
    setOffset(o => o + 1);
  }, []);

  const nowToShow = lastRefresh ?? now;

  const grouped = React.useMemo(() => {
    const groups: Record<string, SegmentAndStreamer[]> = {};
    streams.forEach((stream) => {
      if (!groups[stream.streamer.twitchId]) {
        groups[stream.streamer.twitchId] = [];
      }
      groups[stream.streamer.twitchId].push(stream);
    });
    return Object.values(groups)
      .sort((lhs, rhs) =>
        lhs[0].streamer.displayName.localeCompare(rhs[0].streamer.displayName)
      );
  }, [streams]);

  const rows = React.useMemo(() => (
    grouped.map((streams) => {
      const { streamer, segment } = streams[0];
      return {
        key: streamer.twitchId,
        sidebarItem: (
          <div
            className={styles.streamer}
            style={factionStylesForKey(segment.liveInfo?.tagFaction ?? segment.character?.factions.at(0)?.key)}
          >
            <Link to={`/streamer/${streamer.twitchLogin}`}>
              <ProfilePhoto
                channelInfo={streamer}
                size={isCompact ? 24 : 'sm'}
              />
            </Link>
            <div className={styles.name}>
              <p>
                <Link to={`/streamer/${streamer.twitchLogin}`}>
                  {streamer.displayName}
                </Link>
              </p>
            </div>
          </div>
        ),
        interval: day,
        segments: streams,
      }
    })
  ), [grouped, day, isCompact, factionStylesForKey]);

  return (
    <div className={classes(
      'content',
      'inset',
      styles.content,
      isCompact && styles.compact,
    )}>
      <div className={styles.header}>
        <DayHeader date={toDate(day.start)} />
        <div className={styles.compactSetting}>
          <input
            type='checkbox'
            id='compactCheckbox'
            checked={isCompact}
            onChange={e => setIsCompact(e.target.checked)}
          />
          <label
            htmlFor='compactCheckbox'
          >
            Compact
          </label>
        </div>
        <Button className='button secondary' onClick={previous}>Previous</Button>
        <Button className='button secondary' onClick={next} disabled={isToday}>Next</Button>
      </div>
      {grouped.length === 0 ? hasMore ? (
        <Loading />
      ) : (
        <>
          <h4>No streams</h4>
          <p>There aren’t any recorded streams during this timeframe.</p>
        </>
      ) : (
        <Timeline
          hoursInterval={day}
          rows={rows}
          now={nowToShow}
          autoscrollToTime='now'
          isCompact={isCompact}
          handleReload={reload}
        />
      )}
    </div>
  );
};

export const StreamTimelineContainer: React.FC = () =>
  <StreamTimeline />

export default StreamTimeline;
