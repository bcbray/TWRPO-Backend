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
} from 'date-fns';
import { Link } from 'react-router-dom';
import { useUpdateEffect, useMeasure } from 'react-use';
import { Button } from '@restart/ui';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import { EyeSlashFill } from 'react-bootstrap-icons';
import { SegmentAndStreamer, VideoSegment, Streamer } from '@twrpo/types';

import styles from './Timeline.module.css';

import { useStreams } from './Data';
import { usePaginatedStreams } from './Streams';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import SegmentTitleTag from './SegmentTitleTag'
import Tag from './Tag';
import { useImageUrlOnceLoaded, useWrappedRefWithWarning, useShortDate, useInitialRender } from './hooks';
import Loading from './Loading';
import { useFactionCss } from './FactionStyleProvider';
import OverlayTrigger from './OverlayTrigger'
import VideoSegmentCard from './VideoSegmentCard'

interface TimelineProps {
}

const useDay = (date: Date): Interval => React.useMemo(() => ({
  start: startOfDay(date),
  end: endOfDay(date),
}), [date]);

const useIntervalStreams = (interval: Interval): {
  streams: SegmentAndStreamer[],
  lastRefresh: Date | null,
  hasMore: Boolean,
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

  return {
    streams: overlappingStreams,
    lastRefresh: lastRefresh ?? null,
    hasMore,
  };
}

interface TimelineSegmentProps {
  segment: VideoSegment;
  streamer: Streamer;
  visibleInterval: Interval;
  pixelsPerSecond: number;
}

const TimelineSegment: React.FC<TimelineSegmentProps> = ({
  segment,
  streamer,
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
    <OverlayTrigger
      placement='top-mouse'
      flip
      delay={{ show: 250, hide: 100 }}
      overlay={({ placement, arrowProps, show: _show, popper, ...props }) => (
        <div className={styles.streamPopover} {...props}>
          <VideoSegmentCard
            streamer={streamer}
            segment={segment}
            handleRefresh={() => {}}
            cardStyle={'card'}
            pastStreamStyle={'vivid'}
          />
        </div>
      )}
    >
      <div
        key={segment.id}
        className={classes(
          styles.segment,
          !isEqual(clampStart, streamStart) && styles.overlapLeft,
          !isEqual(clampEnd, streamEnd) && styles.overlapRight,
          segment.liveInfo && styles.live,
          segment.isHidden && styles.hidden,
        )}
        style={{
          left: `${Math.round(startOffsetSec * pixelsPerSecond)}px`,
          right: `${Math.round(endOffsetSec * pixelsPerSecond)}px`,
          '--duration-width':  `${Math.round(duration * pixelsPerSecond)}px`,
          '--clamped-duration-width':  `${Math.round(clampedDuration * pixelsPerSecond)}px`,
        } as React.CSSProperties}
      >
        <div className={styles.segmentContent}>
          {(loadedThumbnailUrl || segment.isHidden) &&
            <div className={styles.thumbnail}>
              {loadedThumbnailUrl &&
                <img alt='Stream thumbnail' src={loadedThumbnailUrl} />
              }
              {segment.isHidden &&
                <div className={styles.hiddenOverlay}>
                  <EyeSlashFill title='Segment is hidden' />
                </div>
              }
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
    </OverlayTrigger>
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
  const { streams, lastRefresh, hasMore } = useIntervalStreams(day);
  const { start, end } = day;
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const isFirstRender = useInitialRender();
  const isToday = React.useMemo(() => !isFirstRender && isWithinInterval(now, day), [isFirstRender, now, day]);

  const [isCompact, setIsCompact] = React.useState(false);
  const { factionStylesForKey } = useFactionCss();

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

  const formattedDate = useShortDate(toDate(start));

  const idealPerHourWidth = React.useMemo(() => {
    const totalHours = totalLength / 60 / 60;
    return measure.width / totalHours;
  }, [measure.width, totalLength]);

  const minPerHourWidth = 50;
  const perHourWidth = idealPerHourWidth < minPerHourWidth ? minPerHourWidth : idealPerHourWidth;
  const width = Math.ceil(perHourWidth * totalLength / 60 / 60);
  const pixelsPerSecond = width / totalLength;

  const streamerRows = React.useMemo(() => grouped.map((streams) => {
    const { segment, streamer } = streams[0];
    return (
      <div
        key={streamer.twitchId}
        className={styles.streamer}
        style={factionStylesForKey(segment.liveInfo?.tagFaction ?? segment.character?.factions.at(0)?.key)}
      >
        <Link to={`/streamer/${streamer.twitchLogin}`}>
          <ProfilePhoto channelInfo={streamer} />
        </Link>
        <div className={styles.name}>
          <p>
            <Link to={`/streamer/${streamer.twitchLogin}`}>
              {streamer.displayName}
            </Link>
          </p>
        </div>
      </div>
    );
  }), [grouped, factionStylesForKey]);

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
        {streams.map(({ streamer, segment }) =>
          <TimelineSegment
            key={segment.id}
            segment={segment}
            streamer={streamer}
            visibleInterval={day}
            pixelsPerSecond={pixelsPerSecond}
          />
        )}
      </div>
    );
  }), [grouped, day, pixelsPerSecond]);

  return (
    <div className={classes(
      'content',
      'inset',
      styles.content,
      isCompact && styles.compact,
    )}>
      <div className={styles.header}>
        <h3>{formattedDate}</h3>
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
