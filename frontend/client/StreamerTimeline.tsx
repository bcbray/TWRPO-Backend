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
} from 'date-fns';
import { Streamer, VideoSegment } from '@twrpo/types';

import styles from './StreamerTimeline.module.css';

import Timeline from './Timeline'
import { useShortDate } from './hooks';


interface StreamerTimelineProps {
  streamer: Streamer;
  segments: VideoSegment[];
  lastLoadTime?: Date;
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

const StreamerTimeline: React.FC<StreamerTimelineProps> = ({ streamer, segments, lastLoadTime }) => {
  const now = React.useMemo(() => lastLoadTime ?? new Date(), [lastLoadTime]);
  const daySeconds = hoursToSeconds(24);
  const maxLength = daySeconds - 1;
  const groups: TimelineDay[]  = React.useMemo(() => {
    const earliestStart = segments.reduce((earliest, segment) => {
      const start = new Date(segment.startDate);
      const startHour = startOfHour(start);
      const startOffset = differenceInSeconds(startHour, startOfDay(start));
      const endOffset = startOffset + maxLength;
      if (earliest === undefined || startOffset < earliest.start) {
        return {
          start: startOffset,
          end: endOffset,
        };
      }
      return earliest;
    }, undefined as TimeInterval | undefined);
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
  }, [segments, maxLength]);

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

  if (intervals === null) {
    return null;
  }
  const { visibleInterval, hoursInterval } = intervals;

  return (
    <Timeline
      hoursInterval={hoursInterval}
      rows={groups.map((group) => ({
        key: formatISO(group.interval.start),
        sidebarItem: <DaySidebarItem date={toDate(group.interval.start)} />,
        interval: {
          start: addSeconds(startOfDay(group.interval.start), visibleInterval.start),
          end: addSeconds(startOfDay(group.interval.start), visibleInterval.end),
        },
        segments: group.segments.map(segment => ({ segment: segment.segment, streamer }))
      }))}
      now={now}
      autoscrollToTime='now'
    />
  )
};

export default StreamerTimeline;