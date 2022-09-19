import React from 'react';
import {
  Interval,
  startOfDay,
  endOfDay,
  differenceInSeconds,
  addDays,
  areIntervalsOverlapping,
  clamp,
  isEqual,
  eachHourOfInterval,
  isWithinInterval,
  formatISO,
  intlFormat,
  toDate,
  format,
} from 'date-fns';
import { useUpdateEffect, useMeasure } from 'react-use';
import { Button } from '@restart/ui';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import { SegmentAndStreamer, VideoSegment } from '@twrpo/types';

import styles from './Timeline.module.css';

import { useStreams } from './Data';
import { usePaginatedStreams } from './Streams';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import SegmentTitleTag from './SegmentTitleTag'
import Tag from './Tag';
import { useImageUrlOnceLoaded, useWrappedRefWithWarning } from './hooks';
import Loading from './Loading';

interface TimelineProps {
}

const useDay = (date: Date): Interval => React.useMemo(() => ({
  start: startOfDay(date),
  end: endOfDay(date),
}), [date]);

const useIntervalStreams = (interval: Interval): {
  streams: SegmentAndStreamer[],
  lastRefresh: Date | null,
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
  });
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (!hasMore) {
      setIsComplete(true);
      return;
    }
    loadMore();
  }, [streams, loadMore, hasMore]);

  useUpdateEffect(() => {
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

  return { streams: overlappingStreams, lastRefresh: lastRefresh ?? null };
}

interface TimelineSegmentProps {
  segment: VideoSegment;
  visibleInterval: Interval;
  pixelsPerSecond: number;
}

const TimelineSegment: React.FC<TimelineSegmentProps> = ({
  segment,
  visibleInterval,
  pixelsPerSecond,
}) => {
  const streamStart = new Date(segment.startDate);
  const streamEnd = new Date(segment.endDate);

  const clampStart = clamp(streamStart, visibleInterval);
  const clampEnd = clamp(streamEnd, visibleInterval);

  const duration = differenceInSeconds(streamEnd, clampStart);
  const clampedDuration = differenceInSeconds(clampEnd, clampStart);

  const startOffsetSec = differenceInSeconds(clampStart, visibleInterval.start);
  const endOffsetSec = differenceInSeconds(visibleInterval.end, clampEnd);

  const thumbnailUrl = React.useMemo(() => {
    const thumbnailUrl = segment.liveInfo?.thumbnailUrl ?? segment.thumbnailUrl;
    if (!thumbnailUrl) return undefined;
    return `${
      thumbnailUrl
        ?.replace(/%?{width}/, '440')
        .replace(/%?{height}/, '248')
    }`
  }, [segment]);

  const { url: loadedThumbnailUrl } = useImageUrlOnceLoaded(thumbnailUrl);
  return (
    <div
      key={segment.id}
      className={classes(
        styles.segment,
        !isEqual(clampStart, streamStart) && styles.overlapLeft,
        !isEqual(clampEnd, streamEnd) && styles.overlapRight,
        segment.liveInfo && styles.live,
      )}
      style={{
        left: `${Math.round(startOffsetSec * pixelsPerSecond)}px`,
        right: `${Math.round(endOffsetSec * pixelsPerSecond)}px`,
        '--duration-width':  `${Math.round(duration * pixelsPerSecond)}px`,
        '--clamped-duration-width':  `${Math.round(clampedDuration * pixelsPerSecond)}px`,
      } as React.CSSProperties}
    >
      <div className={styles.segmentContent}>
        {loadedThumbnailUrl &&
          <div className={styles.thumbnail}>
            <img alt='Stream thumbnail' src={loadedThumbnailUrl} />
          </div>
        }
        <div className={styles.info}>
          <div className={styles.tags}>
            <SegmentTitleTag className={styles.tag} segment={segment} />
            {segment.liveInfo &&
              <Tag className={classes(styles.tag, styles.live)}>
                <p>Live</p>
              </Tag>
            }
          </div>
          <p title={segment.title}>{segment.title}</p>
        </div>
      </div>
    </div>
  );
}

interface HoursHeaderProps {
  visibleInterval: Interval;
  pixelsPerSecond: number;
}

const HoursHeader: React.FC<HoursHeaderProps> = ({
  visibleInterval,
  pixelsPerSecond,
}) => {
  const hours = React.useMemo(() => eachHourOfInterval(visibleInterval), [visibleInterval]);
  const visibleHours = React.useMemo(() => {
    const perHourWidth = pixelsPerSecond * 60 * 60;
    const minLabelWidth = 60;
    let included = 1;
    while (perHourWidth / (1 / included * minLabelWidth) < 1) {
      included += 1;
    }
    return [...hours.slice(1)].filter((_, idx) => idx % included === 0)
  }, [hours, pixelsPerSecond]);

  const formattedHours = React.useMemo(() => (
    visibleHours.map(hour => [hour, intlFormat(hour, { hour: 'numeric' })]) as [Date, string][]
  ), [visibleHours]);

  return (
    <div className={styles.hourHeader}>
      {formattedHours.map(([hour, formatted]) => {
        const offsetSec = differenceInSeconds(hour, visibleInterval.start);
        return (
          <div
            key={formatISO(hour)}
            className={classes(
              styles.hourLabel,
            )}
            style={{
              left: `${Math.round(offsetSec * pixelsPerSecond)}px`,
            }}
          >
            <p>{formatted}</p>
          </div>
        );
      })}
    </div>
  );
}

const Timeline: React.FC<TimelineProps> = () => {
  const now = React.useMemo(() => new Date(), []);
  const [offset, setOffset] = React.useState(0);
  const target = React.useMemo(() => addDays(now, offset), [now, offset])
  const day = useDay(target);
  const { streams, lastRefresh } = useIntervalStreams(day);
  const { start, end } = day;
  const [hasScrolled, setHasScrolled] = React.useState(false);

  const previous = React.useCallback(() => {
    setHasScrolled(false);
    setOffset(o => o - 1);
  }, []);

  const next = React.useCallback(() => {
    setHasScrolled(false);
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

  const totalLength = differenceInSeconds(end, start);

  const [measureRef, measure] = useMeasure<HTMLDivElement>();
  const scrollRef = React.useRef<HTMLDivElement>();
  const ref = useMergedRefs<unknown>(
    scrollRef,
    useWrappedRefWithWarning(measureRef, 'Timeline')
  );

  const formattedDate = React.useMemo(() => format(start, 'PP'), [start]);

  const idealPerHourWidth = React.useMemo(() => {
    const totalHours = totalLength / 60 / 60;
    return measure.width / totalHours;
  }, [measure.width, totalLength]);

  const minPerHourWidth = 100;
  const perHourWidth = idealPerHourWidth < minPerHourWidth ? minPerHourWidth : idealPerHourWidth;
  const width = Math.ceil(perHourWidth * totalLength / 60 / 60);
  const pixelsPerSecond = width / totalLength;

  const streamerRows = React.useMemo(() => grouped.map((streams) => {
    const { streamer } = streams[0];
    return (
      <div
        key={streamer.twitchId}
        className={styles.streamer}
      >
        <ProfilePhoto channelInfo={streamer} />
        {streamer.displayName}
      </div>
    );
  }), [grouped]);

  const hours = eachHourOfInterval(day);
  const hourBars = [...hours, end].map((hour) => {
    const offsetSec = differenceInSeconds(hour, start);
    return (
      <div
        key={formatISO(hour)}
        className={classes(
          styles.hourBar,
        )}
        style={{
          right: `${Math.round(offsetSec * pixelsPerSecond)}px`,
        }}
      />
    );
  })

  if (isWithinInterval(nowToShow, day)) {
    const offsetSec = differenceInSeconds(nowToShow, start);
    hourBars.push(
      <div
        key='now'
        className={classes(
          styles.hourBar,
          styles.now,
        )}
        style={{
          left: `${Math.round(offsetSec * pixelsPerSecond)}px`,
        }}
      />
    );
  }

  React.useEffect(() => {
    if (hasScrolled) {
      return;
    }
    if (measure.width === 0) {
      return;
    }
    if (grouped.length > 0 && isWithinInterval(nowToShow, day)) {
      const offsetSec = differenceInSeconds(nowToShow, start);
      const offset = offsetSec * pixelsPerSecond;
      scrollRef.current?.scrollTo({
        left: offset - measure.width + 20
      });
      setHasScrolled(true);
    }
  }, [grouped, hasScrolled, measure, nowToShow, day, start, pixelsPerSecond]);

  const timelineRows = React.useMemo(() => grouped.map((streams) => {
    const { streamer } = streams[0];
    return (
      <div
        key={streamer.twitchId}
        className={styles.streamerRow}
      >
        {streams.map(({ segment }) =>
          <TimelineSegment
            key={segment.id}
            segment={segment}
            visibleInterval={day}
            pixelsPerSecond={pixelsPerSecond}
          />
        )}
      </div>
    );
  }), [grouped, day, pixelsPerSecond]);

  return (
    <div className={classes('content', 'inset', styles.content)}>
      <div className={styles.header}>
        <h3>{formattedDate}</h3>
        <Button className='button secondary' onClick={previous}>Previous</Button>
        <Button className='button secondary' onClick={next}>Next</Button>
      </div>
      {grouped.length === 0 ? (
        <Loading />
      ) : (
        <div
          className={styles.container}
        >
          <div>
            <div className={classes(styles.streamerContainer, styles.rows)}>
              {streamerRows}
            </div>
            <div ref={ref} className={styles.timelineContainer}>
              <div className={styles.hourBars} style={{ width: `${width}px`}}>
                {hourBars}
              </div>
              <div className={styles.rows} style={{ width: `${width}px` }}>
                <HoursHeader
                  visibleInterval={day}
                  pixelsPerSecond={pixelsPerSecond}
                />
                {timelineRows}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TimelineContainer: React.FC = () =>
  <Timeline />

export default Timeline;
