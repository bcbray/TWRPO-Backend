import React from 'react';
import {
  Interval,
  isWithinInterval,
  startOfDay,
  clamp,
  differenceInSeconds,
  formatISO,
  isBefore,
  addSeconds,
  startOfHour,
  addDays,
  hoursToSeconds,
  endOfHour,
  toDate,
  subDays,
  minutesToSeconds,
  isAfter,
} from 'date-fns';
import { getTimezoneOffset } from 'date-fns-tz';
import { Streamer, VideoSegment } from '@twrpo/types';

import styles from './StreamerTimeline.module.css';

import Timeline, { TimelineRow } from './Timeline'
import { useShortDate, useTimezone } from './hooks';
import Loading from './Loading';


interface StreamerTimelineProps {
  streamer: Streamer;
  segments: VideoSegment[];
  lastLoadTime?: Date;

  isLoadingMore?: boolean;
  loadMoreTrigger?: React.ReactElement;
}

interface TimeInterval {
  start: number;
  end: number;
}

interface TimelineDay {
  interval: Interval;
  segments: TimelineSegment[];
}

interface TimelineSegment {
  segment: VideoSegment;
  timeInterval: TimeInterval;
  overlapsStart: boolean;
  overlapsEnd: boolean;
}

const DaySidebarItem: React.FC<{ date: Date }> = ({ date }) => {
  const shortDate = useShortDate(date);
  return (
    <div className={styles.timelineDate}>
      <p>{shortDate}</p>
    </div>
  )
}

const GapInfoItem: React.FC<{ start: Date, end: Date }> = ({ start, end }) => {
  const shortStart = useShortDate(start, { canUseRelative: false });
  const shortEnd = useShortDate(end, { canUseRelative: false });
  return (
    <div className={styles.gapRow}>
      {start.getTime() !== end.getTime() ? (
        <p>{`No streams ${shortStart}–${shortEnd}`}</p>
      ) : (
        <p>{`No streams ${shortStart}`}</p>
      )}
    </div>
  )
}

const StreamerTimeline: React.FC<StreamerTimelineProps> = ({
  streamer,
  segments,
  lastLoadTime,
  isLoadingMore,
  loadMoreTrigger,
}) => {
  const now = React.useMemo(() => lastLoadTime ?? new Date(), [lastLoadTime]);
  const timezone = useTimezone();
  const earliestStartRef = React.useRef<TimeInterval & { timezone: string } | undefined>();
  const daySeconds = hoursToSeconds(24);
  const maxLength = daySeconds - 1;
  const groups: TimelineDay[]  = React.useMemo(() => {
    if (segments.length === 0) {
      return [];
    }
    let earliestStart: TimeInterval | undefined;
    if (earliestStartRef.current !== undefined && earliestStartRef.current.timezone === timezone) {
      earliestStart = earliestStartRef.current;
    } else {
      const averageStart = streamer.averageStreamStartTimeOffset !== undefined
        ? streamer.averageStreamStartTimeOffset + (getTimezoneOffset(timezone) / 1000)
        : segments.map((segment) => {
          const start = new Date(segment.streamStartDate);
          const startOffset = differenceInSeconds(start, startOfDay(start));
          return startOffset;
        }).reduce((sum, offset) => sum + offset) / segments.length;
      // Back up just a bit before flooring to the hour just to make sure
      // we don’t trim off too many segments if the average is just _barely_
      // into a new hour
      const adjustedAverageStart = averageStart - minutesToSeconds(20);
      // Floor the adjusted average time to the start of the hour
      const startOfToday = startOfDay(now);
      const averageStartHour = startOfHour(addSeconds(startOfToday, adjustedAverageStart));
      const averageStartHourOffset = differenceInSeconds(averageStartHour, startOfToday);
      earliestStart = { start: averageStartHourOffset, end: averageStartHourOffset + maxLength };
      earliestStartRef.current = { ...earliestStart, timezone };
    }

    if (earliestStart === undefined) {
      return [];
    }

    // ISO date for start of day -> TimelineDay
    const groups: Record<string, TimelineDay> = {};
    for (const segment of segments) {
      const start = new Date(segment.startDate);
      const end = new Date(segment.endDate);

      if (!isBefore(start, end)) {
        continue;
      }

      let days: Date[] = [];

      let day = startOfDay(start)

      // If we’re using a start time that puts this segment on the “previous”
      // day, be sure and include the first day
      if (isBefore(start, addSeconds(day, earliestStart.start))) {
        day = subDays(day, 1);
      }

      // Include all days that this segment spans
      while (isBefore(addSeconds(day, earliestStart.start), end)) {
        days.push(day);
        day = addDays(day, 1);
      }

      for (const day of days) {
        let intervalDay: TimelineDay = groups[day.toISOString()];
        if (!intervalDay) {
          intervalDay = {
            interval: {
              start: addSeconds(startOfDay(day), earliestStart.start),
              end: addSeconds(startOfDay(day), earliestStart.end),
            },
            segments: [],
          }
          groups[day.toISOString()] = intervalDay;
        }
        const clampedStart = clamp(start, intervalDay.interval);
        const clampedEnd = clamp(end, intervalDay.interval);
        const timelineSegment: TimelineSegment = {
          segment: segment,
          timeInterval: {
            start: differenceInSeconds(startOfHour(clampedStart), intervalDay.interval.start),
            end: differenceInSeconds(endOfHour(clampedEnd), intervalDay.interval.start),
          },
          overlapsStart: !isWithinInterval(start, intervalDay.interval),
          overlapsEnd: !isWithinInterval(end, intervalDay.interval),
        };
        intervalDay.segments.push(timelineSegment);
      }
    }

    return Object.entries(groups)
      .sort(([lhsDay], [rhsDay]) => lhsDay.localeCompare(rhsDay) * -1)
      .map(([_, day]) => day);
  }, [segments, maxLength, now, timezone, streamer.averageStreamStartTimeOffset]);

  const intervals = React.useMemo(() => {
    let start: number | undefined;
    let end: number | undefined;
    for (const day of groups) {
      const dayStartOffset = differenceInSeconds(day.interval.start, startOfDay(day.interval.start));
      for (const segment of day.segments) {
        const thisStart = dayStartOffset + segment.timeInterval.start;
        if (start === undefined || thisStart < start) {
          start = thisStart;
        }
        const thisEnd = dayStartOffset + segment.timeInterval.end;
        if (end === undefined || thisEnd > end) {
          end = thisEnd;
        }
      }
    }
    if (start === undefined || end === undefined || end - start === 0) {
      return null;
    }
    const visibleInterval = { start, end };

    const referenceDay = groups[0].interval.start;
    const referenceDayStart = startOfDay(referenceDay);
    const referenceStart = addSeconds(referenceDayStart, visibleInterval.start);
    const referenceEnd = addSeconds(referenceDayStart, visibleInterval.end);
    const hoursInterval = { start: referenceStart, end: referenceEnd };
    return { visibleInterval, hoursInterval };
  }, [groups]);

  const data = React.useMemo(() => {
    if (intervals === null) {
      return null;
    }

    const { visibleInterval, hoursInterval } = intervals;

    const rows: TimelineRow[] = [];
    let previousRowStart: Date | undefined;
    for (const group of groups) {
      const start = addSeconds(startOfDay(group.interval.start), visibleInterval.start);
      const nextStart = addDays(start, 1);
      if (previousRowStart && isAfter(previousRowStart, nextStart)) {
        const gapEnd = subDays(previousRowStart, 1);
        rows.push({
          key: `${formatISO(group.interval.start)}-info`,
          info: <GapInfoItem start={nextStart} end={gapEnd} />
        })
      }
      rows.push({
        key: formatISO(group.interval.start),
        sidebarItem: <DaySidebarItem date={toDate(group.interval.start)} />,
        interval: {
          start: start,
          end: addSeconds(startOfDay(group.interval.start), visibleInterval.end),
        },
        segments: group.segments.map(segment => ({ segment: segment.segment, streamer }))
      });
      previousRowStart = start;
    }
    return { rows, hoursInterval };
  }, [groups, intervals, streamer]);

  if (data === null) {
    if (isLoadingMore) {
      return <Loading />;
    }
    return null;
  }
  const { hoursInterval, rows } = data;

  return (
    <Timeline
      hoursInterval={hoursInterval}
      rows={rows}
      now={now}
      autoscrollToTime='now'
      isLoadingMore={isLoadingMore}
      loadMoreTrigger={loadMoreTrigger}
    />
  )
};

export default StreamerTimeline;
