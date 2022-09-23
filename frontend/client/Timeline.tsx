import React from 'react';
import { useMeasure } from 'react-use';
import useMergedRefs from '@restart/hooks/useMergedRefs';
import {
  Interval,
  differenceInSeconds,
  eachHourOfInterval,
  formatISO,
  intlFormat,
  isWithinInterval,
  startOfDay,
  isEqual,
} from 'date-fns';
import { SegmentAndStreamer } from '@twrpo/types';

import styles from './Timeline.module.css';

import { classes } from './utils';
import { useWrappedRefWithWarning } from './hooks';
import TimelineSegment from './TimelineSegment';
import { useIsFirstRenderFromSSR } from './Data';
import Loading from './Loading';

export interface TimelineSegmentsRow {
  key: string;
  sidebarItem?: React.ReactNode;
  interval: Interval;
  segments: SegmentAndStreamer[];
}

export interface TimelineInfoRow {
  key: string;
  info: React.ReactNode;
  sidebarItem?: React.ReactNode;
}

export type TimelineRow = TimelineSegmentsRow | TimelineInfoRow;

export interface TimelineProps {
  hoursInterval?: Interval;
  rows: TimelineRow[];

  /**
    If provided, a line indicating “now” will be drawn.
    Requires providing `hoursInterval`.
  */
  now?: Date;

  /**
    Scrolls to the given time on first load.
    Requires providing `hoursInterval`. The 'now' value requires providing `now`.
  */
  autoscrollToTime?: 'now' | Date;

  isCompact?: boolean;
  handleReload?: () => void;
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

const Timeline: React.FC<TimelineProps> = ({
  hoursInterval,
  rows,
  now,
  autoscrollToTime,
  isCompact = false,
  handleReload,
}) => {

  const sidebarItems = rows.map(row => ({
    key: row.key,
    item: row.sidebarItem,
    isInfo: !('segments' in row),
  }))
  const hasSidebar = sidebarItems.some(({ item }) => item !== undefined);

  const [hasAutoScrolled, setHasAutoScrolled] = React.useState(false);
  const [measureRef, measure] = useMeasure<HTMLDivElement>();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const ref = useMergedRefs<unknown>(
    scrollRef,
    useWrappedRefWithWarning(measureRef, 'Timeline')
  );

  const [hoveredRowKey, setHoveredRowKey] = React.useState<string | null>(null);

  const totalTimeSeconds = rows.reduce((maxTime, row) => {
    if (!('interval' in row)) {
      return maxTime;
    }
    const time = differenceInSeconds(row.interval.end, row.interval.start);
    if (time > maxTime) {
      return time;
    }
    return maxTime;
  }, 0);

  const idealPerHourWidth = React.useMemo(() => {
    if (totalTimeSeconds <= 0) {
      return 0;
    }
    const totalHours = totalTimeSeconds / 60 / 60;
    return measure.width / totalHours;
  }, [measure.width, totalTimeSeconds]);

  const minPerHourWidth = 50;
  const perHourWidth = idealPerHourWidth < minPerHourWidth ? minPerHourWidth : idealPerHourWidth;
  const width = Math.ceil(perHourWidth * totalTimeSeconds / 60 / 60);
  const pixelsPerSecond = width / totalTimeSeconds;

  React.useEffect(() => {
    if (hasAutoScrolled) {
      return;
    }
    if (measure.width === 0) {
      return;
    }
    const autoscrollTimeToUse = autoscrollToTime === 'now' ? now : autoscrollToTime;
    if (hoursInterval === undefined || autoscrollTimeToUse === undefined) {
      return;
    }
    if (rows.length > 0 && isWithinInterval(autoscrollTimeToUse, hoursInterval)) {
      const offsetSec = differenceInSeconds(autoscrollTimeToUse, hoursInterval.start);
      const offset = offsetSec * pixelsPerSecond;
      scrollRef.current?.scrollTo({
        left: offset - measure.width + 20
      });
      setHasAutoScrolled(true);
    }
  }, [rows, hasAutoScrolled, hoursInterval, measure, pixelsPerSecond, autoscrollToTime, now]);

  const hourBars = React.useMemo(() => {
    if (hoursInterval === undefined) {
      return undefined;
    }
    const hours = eachHourOfInterval(hoursInterval);
    const bars = hours.slice(1).map((hour) => {
      const offsetSec = differenceInSeconds(hour, hoursInterval.start);
      return (
        <div
          key={formatISO(hour)}
          className={classes(
            styles.hourBar,
            isEqual(hour, startOfDay(hour)) && styles.midnight,
          )}
          style={{
            left: `${Math.round(offsetSec * pixelsPerSecond)}px`,
          }}
        />
      );
    });

    if (now && isWithinInterval(now, hoursInterval)) {
      const offsetSec = differenceInSeconds(now, hoursInterval.start);
      bars.push(
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

    return bars;
  }, [hoursInterval, pixelsPerSecond, now]);

  const sidebarRows = React.useMemo(() => (
    sidebarItems.map(({ key, item, isInfo }) =>
      <div
        key={key}
        className={classes(
          isInfo ? styles.sidebarInfoRow : styles.sidebarRow,
          hoveredRowKey === key && styles.hovered
        )}
        onMouseEnter={() => setHoveredRowKey(key)}
        onMouseLeave={() => setHoveredRowKey(k => (k === key ? null : k))}
      >
        <div>{item}</div>
      </div>
    )
  ), [sidebarItems, hoveredRowKey]);

  const timelineRows = React.useMemo(() => (
    rows.map((row) => {
      if ('interval' in row) {
        const { key, interval, segments } = row;
        return (
          <div
            key={key}
            className={classes(
              styles.timelineRow,
              hoveredRowKey === key && styles.hovered
            )}
            onMouseEnter={() => setHoveredRowKey(key)}
            onMouseLeave={() => setHoveredRowKey(k => (k === key ? null : k))}
          >
            <div>
              {segments.map(({ segment, streamer}) =>
                <TimelineSegment
                  key={segment.id}
                  segment={segment}
                  streamer={streamer}
                  visibleInterval={interval}
                  pixelsPerSecond={pixelsPerSecond}
                  compact={isCompact}
                  handleRefresh={handleReload ?? (() => {})}
                />
              )}
            </div>
          </div>
        )
      } else {
        const { key, info } = row;
        return (
          <div
            key={key}
            className={classes(
              styles.timelineInfoRow,
              hoveredRowKey === key && styles.hovered
            )}
            onMouseEnter={() => setHoveredRowKey(key)}
            onMouseLeave={() => setHoveredRowKey(k => (k === key ? null : k))}
          >
            <div>
              {info}
            </div>
          </div>
        );
      }
    })
  ), [rows, hoveredRowKey, isCompact, handleReload, pixelsPerSecond]);

  const isInitialRenderFromSSR = useIsFirstRenderFromSSR();
  if (isInitialRenderFromSSR) {
    return <Loading />;
  }

  return (
    <div
      className={classes(
        styles.content,
        isCompact && styles.compact
      )}
    >
      <div className={styles.container} >
        {hasSidebar &&
          <div
            className={classes(
              styles.sidebar,
              hourBars && styles.hasHourHeader
            )}
          >
            {sidebarRows}
          </div>
        }
        <div ref={ref} className={styles.timelineContainer}>
          <div className={styles.rows} style={{ width: `${width}px` }}>
            <>
              {hourBars}
              {hoursInterval &&
                <HoursHeader
                  visibleInterval={hoursInterval}
                  pixelsPerSecond={pixelsPerSecond}
                />
              }
              {timelineRows}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
