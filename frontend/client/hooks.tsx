import { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext, DependencyList } from 'react';
import { useSearchParams, NavigateOptions } from 'react-router-dom';
import { useDebounce, usePreviousDistinct, useUpdateEffect } from 'react-use';
import useTimeout from '@restart/hooks/useTimeout';
import Waypoint from '@restart/ui/Waypoint';
import { WaypointEvent, Position } from '@restart/ui/useWaypoint';
import _ from 'lodash';
import { isSameDay, subDays } from 'date-fns';
import isMobile, { IsMobileOptions } from 'is-mobile';

import { useNow, useIsFirstRenderFromSSR } from './Data';

const isBrowser = typeof window !== 'undefined';

export const useSingleSearchParam = (name: string): [string, ((value: string, options?: NavigateOptions) => void)] => {
  const [params, setParams] = useSearchParams();
  const setParam = useCallback((value: string, options?: NavigateOptions) => {
    var newParams = new URLSearchParams(params);
    if (value.length > 0) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setParams(newParams, options);
  }, [name, params, setParams]);

  const param = params.get(name) ?? '';
  return [param, setParam];
};

export const useDevicePixelRatio = (fallback: number = 1) => {
  const [ratio, setRatio] = useState(fallback);

  useEffect(() => {
    if (isBrowser) {
      const handler = () => setRatio(window.devicePixelRatio);

      // ref: https://bugs.chromium.org/p/chromium/issues/detail?id=123694
      const media = window.matchMedia('screen and (min-resolution: 1.5)');
      media.addEventListener('change', handler);
      return () => {
        media.removeEventListener('change', handler);
      }
    }
    return () => {};
  }, []);

  return ratio;
}

export function useWrappedRefWithWarning(ref: any, componentName: any): any {
  // Yeahhh... about that warning...
  return ref;
}

export function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useDebounce(() => {
    setDebounced(value);
  }, ms, [value]);
  return debounced;
};

// Once it's `true` once, it's `true` forever
export const useOneWayBoolean = (value: boolean): boolean => {
  const previous = usePreviousDistinct(value);
  return previous || value;
}

export function useDelayed<T>(value: T, delay: number): T {
  const timeout = useTimeout();

  const [effectiveValue, setEffectiveValue] = useState(value);
  const valueRef = useRef<T>(value);

  const handleChange = useCallback((value: T) => {
    timeout.clear();
    valueRef.current = value;

    if (!delay) {
      setEffectiveValue(value);
      return;
    }

    timeout.set(() => {
      if (valueRef.current === value) setEffectiveValue(value);
    }, delay);
  }, [delay, timeout]);

  useUpdateEffect(() => {
    handleChange(value);
  }, [value]);

  return effectiveValue;
};

const hasFocus = () => typeof document !== 'undefined' && document.hasFocus()

export function useWindowFocus(): boolean {
  const [focused, setFocused] = useState(true);
  useEffect(() => {
    setFocused(hasFocus());

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    }
  }, []);

  return focused;
}

export function useInitialRender(): boolean {
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => setFirstRender(false), []);
  return firstRender;
}

export function useBaseDateFormattingOptions(): { dateFormatOptions: Intl.DateTimeFormatOptions, locale?: string } {
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();

  // Use en-US for the first render so we're consistent between SSR and the
  // first client-side render. Then immediately swap in client locale.
  const locale = isFirstRenderFromSSR ? 'en-US' : undefined;

  // Similarly, use America/New_York for the first render then fall back to
  // client time zone.
  const dateFormatOptions = useMemo(() => ({
    timeZone: isFirstRenderFromSSR ? 'America/New_York' : undefined,
  }), [isFirstRenderFromSSR]);

  return { dateFormatOptions, locale };
}

export interface RelativeDateResult {
  full: string;
  relative: string;
}

interface NowDiff {
  type: 'now';
}

interface RelativeMinuteDiff {
  type: 'minutes';
  value: number;
}

interface RelativeHourDiff {
  type: 'hours';
  value: number;
}

interface RelativeDayDiff {
  type: 'days';
  value: number;
}

interface GenericDateDiff {
  type: 'generic';
  sameYear: boolean;
  date: Date;
}

type RelativeDateDiff = NowDiff | RelativeMinuteDiff | RelativeHourDiff | RelativeDayDiff | GenericDateDiff;

function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (!(a instanceof Object) || !(b instanceof Object)) return false;

  var keys = Object.keys(a);
  for (let i = 0; i < keys.length; i++) {
    if (!(keys[i] in b)) return false;
  }
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof T;
    if (a[key] !== b[key]) return false;
  }
  return keys.length === Object.keys(b).length;
}

export function useShallowCompareMemo<Result, Deps extends DependencyList>(memo: () => Result, deps: Deps): Result {
  const depsRef = useRef<Deps | undefined>(undefined);
  const ref = useRef<Result | undefined>(undefined);
  return useMemo(() => {
    if (ref.current === undefined || depsRef.current === undefined || !depsRef.current.every((prev: any, i) => shallowEqual(prev, deps[i] as any))) {
      depsRef.current = deps;
      ref.current = memo();
      return ref.current;
    }
    return ref.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function relativeDateDiff(date: Date, now: Date): RelativeDateDiff {
  const diffSeconds = (date.getTime() - now.getTime()) / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;
  const diffWeeks = diffDays / 7;
  if (diffSeconds > 0) {
    return { type: 'now' };
  } else if (Math.abs(diffMinutes) < 1) {
    return { type: 'now' };
  } else if (Math.abs(diffHours) < 1) {
    return { type: 'minutes', value: Math.round(diffMinutes) };
  } else if (Math.abs(diffDays) < 1) {
    return { type: 'hours', value: Math.round(diffHours) };
  } else if (Math.abs(diffWeeks) < 2) {
    return { type: 'days', value: Math.round(diffDays) };
  } else {
    return {
      type: 'generic',
      sameYear: date.getFullYear() === now.getFullYear(),
      date
    };
  }
}

export function useRelativeDateMaybe(date: Date | undefined): RelativeDateResult | undefined {
  const now = useNow();
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();
  const { dateFormatOptions, locale } = useBaseDateFormattingOptions()

  const fullFormatOptions: Intl.DateTimeFormatOptions = useMemo(() => ({
    ...dateFormatOptions,
    timeZoneName: isFirstRenderFromSSR ? 'short' : undefined,
  }), [dateFormatOptions, isFirstRenderFromSSR]);

  const formatter = useMemo(() => (
    new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  ), [locale]);

  const diff = useMemo(() => {
    if (!date) return undefined;
    return relativeDateDiff(date, now)
  }, [date, now]);

  return useShallowCompareMemo(() => {
    if (!diff || !date) return undefined;
    const full = date.toLocaleString(locale, fullFormatOptions);
    let relative: string;
    if (diff.type === 'now') {
      relative = 'just now'
    } else if (diff.type === 'minutes') {
      relative = formatter.format(Math.round(diff.value), 'minutes');
    } else if (diff.type === 'hours') {
      relative = formatter.format(Math.round(diff.value), 'hours');
    } else if (diff.type === 'days') {
      relative = formatter.format(Math.round(diff.value), 'days');
    } else if (diff.sameYear) {
      relative = date.toLocaleDateString(locale, {
         ...dateFormatOptions,
         month: 'short',
         day: 'numeric',
       });
     } else {
      relative = date.toLocaleDateString(locale, {
        ...dateFormatOptions,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return {
      // Replace U+202F (NARROW NO-BREAK SPACE) with plain spaces to normalize output between server and client rendering
      relative: relative.replaceAll('\u202F', ' '),
      full: full.replaceAll('\u202F', ' '),
    }
  }, [diff, date, formatter, locale, fullFormatOptions, dateFormatOptions]);
}

export function useRelativeDate(date: Date): RelativeDateResult {
  return useRelativeDateMaybe(date)!;
}

function shortDate(date: Date, now: Date, locale: string | undefined, formatOptions: Intl.DateTimeFormatOptions): string {
  const dateYear = date.toLocaleDateString(locale, {
    ...formatOptions,
    year: 'numeric',
  });
  const nowYear = now.toLocaleDateString(locale, {
    ...formatOptions,
    year: 'numeric',
  });
  if (dateYear === nowYear) {
    return date.toLocaleDateString(locale, {
      ...formatOptions,
      month: 'short',
      day: 'numeric',
    })
  }
  return date.toLocaleDateString(locale, {
    ...formatOptions,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export interface ShortDateOptions {
  showToday?: boolean;
  showYesterday?: boolean;
}

export function useShortDate(date: Date, options: ShortDateOptions = {}): string {
  const {
    showToday = false,
    showYesterday = false,
  } = options;
  const now = useNow();
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();

  const { dateFormatOptions, locale } = useBaseDateFormattingOptions()

  if (showToday && !isFirstRenderFromSSR && isSameDay(date, now)) {
    return 'Today'
  }
  if (showYesterday && !isFirstRenderFromSSR && isSameDay(date, subDays(now, 1))) {
    return 'Yesterday'
  }

  return shortDate(date, now, locale, dateFormatOptions);
}

export interface ShortDateOptions {
  /** Use dates like “yesterday” and “today”. Default true */
  canUseRelative?: boolean;
}

export function useWeekday(
  date: Date,
  options: ShortDateOptions & { weekday?: Intl.DateTimeFormatOptions['weekday'] } = {}
): string {
  const {
    showToday = false,
    showYesterday = false,
    weekday = 'long',
  } = options;
  const now = useNow();
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();

  const { dateFormatOptions, locale } = useBaseDateFormattingOptions()

  const formatter = useMemo(() => (
    new Intl.DateTimeFormat(locale, {
      ...dateFormatOptions,
      weekday,
    })
  ), [locale, dateFormatOptions, weekday]);

  const formatted =  useMemo(() => (
    formatter.format(date)
  ), [date, formatter]);

  if (showToday && !isFirstRenderFromSSR && isSameDay(date, now)) {
    return 'Today'
  }

  if (showYesterday && !isFirstRenderFromSSR && isSameDay(date, subDays(now, 1))) {
    return 'Yesterday'
  }

  return formatted;
}

/**
 * Passthrough the given image URL, along with loading and failed state.
 */
export function useLoadStateImageUrl<T extends (string | undefined)>(url: T): { url: T | undefined, loading: boolean, failed: boolean} {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const onload = useCallback(() => {
    setLoading(false);
    setFailed(false);
  }, []);

  const onerror = useCallback(() => {
    setLoading(false);
    setFailed(true);
  }, []);

  useEffect(() => {
    if (!url || !document) {
      setLoading(false);
      setFailed(false);
      return;
    }
    setLoading(true);
    const image = new Image();
    image.addEventListener('load', onload);
    image.addEventListener('error', onerror);
    image.src = url;
    return () => {
      image.removeEventListener('load', onload);
      image.removeEventListener('error', onerror);
    }
  }, [url, onload, onerror]);

  return { url, loading, failed };
}

/**
 * Delays image URLs until the image has been loaded once (and thus is cached).
 * The initial URL will be returned immediately and no pre-loading will occur.
 *
 * In the case on an error, the previous URL will continue to be returned, as
 * well as the `failed` (until a subsequent load succeeded).
 */
export function useUpdatedImageUrlOnceLoaded<T extends (string | undefined)>(url: T): { url: T, loading: boolean, failed: boolean} {
  const [loadedUrl, setLoadedUrl] = useState(url);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const onload = useCallback(() => {
    setLoadedUrl(url);
    setLoading(false);
    setFailed(false);
  }, [url]);

  const onerror = useCallback(() => {
    setLoading(false);
    setFailed(true);
  }, []);

  useUpdateEffect(() => {
    if (!url || !document) {
      setLoading(false);
      setFailed(false);
      setLoadedUrl(url);
      return;
    }
    setLoading(true);
    const image = new Image();
    image.addEventListener('load', onload);
    image.addEventListener('error', onerror);
    image.src = url;
    return () => {
      image.removeEventListener('load', onload);
      image.removeEventListener('error', onerror);
    }
  }, [url, onload, onerror]);

  return { url: loadedUrl, loading, failed };
}

export const LoadTrigger: React.FC<{ loadMore: () => void }> = ({ loadMore }) => {
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  const onPositionChange = useCallback(({ position }: WaypointEvent) => {
    if (hasBeenSeen) {
      return;
    }
    if (position !== Position.INSIDE) {
      return;
    }
    loadMore();
    setHasBeenSeen(true);
  }, [hasBeenSeen, loadMore]);

  return <Waypoint
    scrollDirection={'vertical'}
    onPositionChange={onPositionChange}
  />
}

interface PaginationOptions {
  key: number | string;
  initialPageSize?: number;
  subsequentPageSize?: number;
}
export const usePaginated = <T,>(data: T[], options: PaginationOptions): [T[], React.ReactElement | undefined] => {
  const {
    key,
    initialPageSize = 72,
    subsequentPageSize = 24,
  } = options;

  const [currentLength, setCurrentLength] = useState(initialPageSize);
  useEffect(() => (
    setCurrentLength(initialPageSize)
  // We explicitly don't want to reset on initialPageSize changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [key]);

  const loadMore = useCallback(() => {
    setCurrentLength(l => l + subsequentPageSize);
  }, [subsequentPageSize]);
  const currentData = useMemo(() => data.slice(0, currentLength), [data, currentLength]);

  return [
    currentData,
    currentData.length < data.length
      ? <LoadTrigger key={currentLength} loadMore={loadMore} />
      : undefined
  ];
}

export const useFilterRegex = (filterText: string | undefined) => {
  return useMemo(() => {
    if (!filterText) return undefined;
    const escapedFilter = _.escapeRegExp(filterText)
      // Match curly or straight quotes
      // So “O’Grady” and “O'Grady” both match “O’Grady”
      .replaceAll(/['‘’]/g, '[‘’\']')
      .replaceAll(/["“”]/g, '[“”"]');

    return new RegExp(escapedFilter, 'i');
  }, [filterText]);
}

export const useTimezone = (): string => {
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();
  if (isFirstRenderFromSSR) {
    return 'America/New_York';
  } else {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export interface ServerHookData {
  userAgent: IsMobileOptions['ua'];
}

export const ServerHookContext = createContext<Partial<ServerHookData>>({});

export const ServerHookDataProvider: React.FC<{
  data: ServerHookData,
  children: React.ReactElement
}>  = ({
  data,
  children,
}) => (
  <ServerHookContext.Provider value={data}>
    {children}
  </ServerHookContext.Provider>
);


export const useIsMobile = () => {
  const { userAgent } = useContext(ServerHookContext);
  return useMemo(() => isMobile({ ua: userAgent }), [userAgent]);
}
