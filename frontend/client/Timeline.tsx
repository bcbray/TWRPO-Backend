import React from 'react';
import { useMeasure, usePrevious } from 'react-use';
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
  clamp,
} from 'date-fns';
import { Flipper, Flipped, spring } from 'react-flip-toolkit';
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
  previousInterval?: Interval;
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

  loadTick?: number;

  isLoadingMore?: boolean;
  loadMoreTrigger?: React.ReactElement;
}

interface HoursHeaderProps {
  visibleInterval: Interval;
  pixelsPerSecond: number;
}

const HoursHeader: React.FC<HoursHeaderProps> = ({
  visibleInterval,
  pixelsPerSecond,
}) => {
  const previousVisibleInterval = usePrevious(visibleInterval);
  const previousPixelsPerSecond = usePrevious(pixelsPerSecond);
  const visibleIntervalRef = React.useRef(visibleInterval);
  const pixelsPerSecondRef = React.useRef(pixelsPerSecond);
  visibleIntervalRef.current = visibleInterval;
  pixelsPerSecondRef.current = pixelsPerSecond;

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

  const springs = React.useRef<Record<string, ReturnType<typeof spring>>>({});
  const removeSpring = React.useCallback((springKey: string) => {
      if (springs.current[springKey] !== undefined) {
        springs.current[springKey].destroy();
        delete springs.current[springKey];
      }
  }, []);
  const removing = React.useRef<Record<string, true>>({});

  return (
    <div className={styles.hourHeader}>
      {formattedHours.map(([hour, formatted]) => {
        const offsetSec = differenceInSeconds(hour, visibleInterval.start);
        const appearOffsetSec = previousVisibleInterval !== undefined
          ? differenceInSeconds(hour, previousVisibleInterval.start)
          : offsetSec;
        const left = Math.round(offsetSec * pixelsPerSecond);
        const previousLeft = Math.round(appearOffsetSec * (previousPixelsPerSecond ?? pixelsPerSecond));
        const key = formatISO(hour);
        const flipKey = `hourLabel:${key}`;
        return (
          <Flipped
            key={key}
            flipId={flipKey}
            shouldFlip={() => !removing.current[flipKey]}
            onAppear={(el) => {
              removeSpring(flipKey);
              springs.current[flipKey] = spring({
                values: {
                  opacity: [0, 1],
                  left: [previousLeft, left]
                },
                onUpdate: (snapshot) => {
                  if (typeof snapshot === 'number') {
                    return;
                  }
                  const { opacity, left } = snapshot;
                  el.style.opacity = `${opacity}`;
                  el.style.left = `${left}px`;
                },
                onComplete: () => removeSpring(flipKey),
              })
            }}
            onStart={() => removeSpring(flipKey)}
            onExit={(el, _, removeElement) => {
              const nextOffsetSec = differenceInSeconds(hour, visibleIntervalRef.current.start);
              const nextLeft = Math.round(nextOffsetSec * pixelsPerSecondRef.current);

              removing.current[flipKey] = true;
              removeSpring(flipKey);

              springs.current[flipKey] = spring({
                values: {
                  opacity: [1, 0],
                  left: [left, nextLeft]
                },
                onUpdate: (snapshot) => {
                  if (typeof snapshot === 'number') {
                    return;
                  }
                  const { opacity, left } = snapshot;
                  el.style.opacity = `${opacity}`;
                  el.style.left = `${left}px`;
                },
                onComplete: () => {
                  removeElement();
                  removeSpring(flipKey);
                  delete removing.current[flipKey];
                },
              })
            }}
          >
            <div
              className={classes(
                styles.hourLabel,
              )}
              style={{
                left: `${Math.round(offsetSec * pixelsPerSecond)}px`,
              }}
            >
              <p>{formatted}</p>
            </div>
          </Flipped>
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
  loadTick = 0,
  isLoadingMore = false,
  loadMoreTrigger,
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
  const [hoveredSegmentId, setHoveredSegmentIdKey] = React.useState<number | null>(null);

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

  const previousHoursInterval = usePrevious(hoursInterval);
  const previousPixelsPerSecond = usePrevious(pixelsPerSecond);

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

  const springs = React.useRef<Record<string, ReturnType<typeof spring>>>({});
  const removeSpring = React.useCallback((springKey: string) => {
      if (springs.current[springKey] !== undefined) {
        springs.current[springKey].destroy();
        delete springs.current[springKey];
      }
  }, []);

  const hourBars = React.useMemo(() => {
    if (hoursInterval === undefined) {
      return undefined;
    }
    const hours = eachHourOfInterval(hoursInterval);
    const bars = hours.slice(1).map((hour) => {
      const offsetSec = differenceInSeconds(hour, hoursInterval.start);
      const appearOffsetSec = previousHoursInterval !== undefined
        ? differenceInSeconds(hour, previousHoursInterval.start)
        : offsetSec;
      const left = Math.round(offsetSec * pixelsPerSecond);
      const appearLeft = Math.round(appearOffsetSec * (previousPixelsPerSecond ?? pixelsPerSecond));
      const key = formatISO(hour);
      const flipKey = `hourBar:${key}`;
      return (
        <Flipped
          key={key}
          flipId={flipKey}
          onAppear={(el) => {
            removeSpring(flipKey);
            springs.current[flipKey] = spring({
              values: {
                opacity: [0, 1],
                left: [appearLeft, left]
              },
              onUpdate: (snapshot) => {
                if (typeof snapshot === 'number') {
                  return;
                }
                const { opacity, left } = snapshot;
                el.style.opacity = `${opacity}`;
                el.style.left = `${left}px`;
              },
              onComplete: () => removeSpring(flipKey),
            })
          }}
          onStart={() => removeSpring(flipKey)}
        >
          <div
            className={classes(
              styles.hourBar,
              isEqual(hour, startOfDay(hour)) && styles.midnight,
            )}
            style={{
              left: `${left}px`,
            }}
          />
        </Flipped>
      );
    });

    if (now && isWithinInterval(now, hoursInterval)) {
      const offsetSec = differenceInSeconds(now, hoursInterval.start);
      const appearOffsetSec = previousHoursInterval !== undefined
        ? differenceInSeconds(now, previousHoursInterval.start)
        : offsetSec;
      const left = Math.round(offsetSec * pixelsPerSecond);
      const appearLeft = Math.round(appearOffsetSec * (previousPixelsPerSecond ?? pixelsPerSecond));
      bars.push(
        <Flipped
          key='now'
          flipId='now'
          onAppear={(el) => {
            removeSpring('now');
            springs.current['now'] = spring({
              values: {
                opacity: [0, 1],
                left: [appearLeft, left]
              },
              onUpdate: (snapshot) => {
                if (typeof snapshot === 'number') {
                  return;
                }
                const { opacity, left } = snapshot;
                el.style.opacity = `${opacity}`;
                el.style.left = `${left}px`;
              },
              onComplete: () => removeSpring('now'),
            })
          }}
          onStart={() => removeSpring('now')}
        >
          <div
            key='now'
            className={classes(
              styles.hourBar,
              styles.now,
            )}
            style={{
              left: `${left}px`,
            }}
          />
        </Flipped>
      );
    }

    return bars;
  }, [hoursInterval, pixelsPerSecond, now, previousPixelsPerSecond, previousHoursInterval, removeSpring]);

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
        const { key, interval, segments, previousInterval } = row;
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
              {segments.map(({ segment, streamer }) => {
                const streamStart = new Date(segment.startDate);
                const streamEnd = new Date(segment.endDate);

                const clampStart = clamp(streamStart, interval);
                const clampEnd = clamp(streamEnd, interval);

                const startOffsetSec = differenceInSeconds(clampStart, interval.start);
                const endOffsetSec = differenceInSeconds(interval.end, clampEnd);

                const left = Math.round(startOffsetSec * pixelsPerSecond);
                const right = Math.round(endOffsetSec * pixelsPerSecond);

                const previousStartOffsetSec = differenceInSeconds(streamStart, previousInterval?.start ?? interval.start);
                const previousEndOffsetSec = differenceInSeconds(previousInterval?.end ?? interval.end, streamEnd);

                const previousLeft = Math.round(previousStartOffsetSec * (previousPixelsPerSecond ?? pixelsPerSecond));
                const previousRight = Math.round(previousEndOffsetSec * (previousPixelsPerSecond ?? pixelsPerSecond));

                const flipKey = `${key}:${segment.id}`;

                return (
                  <Flipped
                    key={segment.id}
                    flipId={flipKey}
                    onAppear={(el) => {
                      removeSpring(flipKey);
                      springs.current[flipKey] = spring({
                        values: {
                          opacity: [0, 1],
                          left: [previousLeft, left],
                          right: [previousRight, right],
                        },
                        onUpdate: (snapshot) => {
                          if (typeof snapshot === 'number') {
                            return;
                          }
                          const { opacity, left, right } = snapshot;
                          el.style.opacity = `${opacity}`;
                          el.style.left = `${left}px`;
                          el.style.right = `${right}px`;
                        },
                        onComplete: () => removeSpring(flipKey),
                      })
                    }}
                    onStart={() => removeSpring(flipKey)}
                  >
                  {flippedProps =>
                    <TimelineSegment
                      segment={segment}
                      streamer={streamer}
                      visibleInterval={interval}
                      pixelsPerSecond={pixelsPerSecond}
                      compact={isCompact}
                      handleRefresh={handleReload ?? (() => {})}
                      onMouseEnter={() => setHoveredSegmentIdKey(segment.id)}
                      onMouseLeave={() => setHoveredSegmentIdKey(id => segment.id === id ? null : id)}
                      hovered={hoveredSegmentId === segment.id}
                      style={{
                        left: `${Math.round(startOffsetSec * pixelsPerSecond)}px`,
                        right: `${Math.round(endOffsetSec * pixelsPerSecond)}px`,
                      }}
                      {...flippedProps}
                    />
                  }
                  </Flipped>
                );
              })}
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
  ), [rows, hoveredRowKey, isCompact, handleReload, pixelsPerSecond, previousPixelsPerSecond, removeSpring, hoveredSegmentId]);

  const isInitialRenderFromSSR = useIsFirstRenderFromSSR();
  if (isInitialRenderFromSSR) {
    return <Loading />;
  }

  return (
    <Flipper
      flipKey={`${loadTick}:${hoursInterval?.start}:${hoursInterval?.end}`}
      handleEnterUpdateDelete={({
        hideEnteringElements,
        animateExitingElements,
        animateFlippedElements,
        animateEnteringElements,
      }) => {
        hideEnteringElements();
        animateEnteringElements();
        animateExitingElements();
        animateFlippedElements();
      }}
    >
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
        {(isLoadingMore || loadMoreTrigger) &&
          <div className={styles.spinnerCard}>
            {loadMoreTrigger}
            {isLoadingMore && <Loading />}
          </div>
        }
      </div>
    </Flipper>
  );
};

export default Timeline;
