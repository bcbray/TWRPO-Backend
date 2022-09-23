import { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } from 'react';
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

export interface RelativeDateResult {
  full: string;
  relative: string;
}

export function useRelativeDateMaybe(date: Date | undefined): RelativeDateResult | undefined {
  const now = useNow();
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();

  // Use en-US and UTC for the first render so we're consistent between SSR and the
  // first client-side render. Then immediately swap in client local.
  const locale = isFirstRenderFromSSR ? 'en-US' : undefined;

  // Similarly, use UTC for the first render then fall back to client time zone.
  const dateFormatOptions: Intl.DateTimeFormatOptions = useMemo(() => ({
    timeZone: isFirstRenderFromSSR ? 'utc' : undefined,
  }), [isFirstRenderFromSSR]);

  const fullFormatOptions: Intl.DateTimeFormatOptions = useMemo(() => ({
    ...dateFormatOptions,
    timeZoneName: isFirstRenderFromSSR ? 'short' : undefined,
  }), [dateFormatOptions, isFirstRenderFromSSR]);

  const formatter = useMemo(() => (
    new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  ), [locale]);

  return useMemo(() => {
    if (!date) return undefined;
    const full = date.toLocaleString(locale, fullFormatOptions);
    let relative: string;
    const diffSeconds = (date.getTime() - now.getTime()) / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    const diffWeeks = diffDays / 7;
    if (diffSeconds > 0) {
      relative = 'just now'
    } else if (Math.abs(diffMinutes) < 1) {
      relative = 'just now'
    } else if (Math.abs(diffHours) < 1) {
      relative = formatter.format(Math.round(diffMinutes), 'minutes');
    } else if (Math.abs(diffDays) < 1) {
      relative = formatter.format(Math.round(diffHours), 'hours');
    } else if (Math.abs(diffWeeks) < 2) {
      relative = formatter.format(Math.round(diffDays), 'days');
    } else {
      relative = shortDate(date, now, locale, dateFormatOptions);
    }

    return { relative, full }
  }, [now, date, formatter, locale, fullFormatOptions, dateFormatOptions]);
}

export function useRelativeDate(date: Date): RelativeDateResult {
  return useRelativeDateMaybe(date)!;
}

function shortDate(date: Date, now: Date, locale: string | undefined, formatOptions: Intl.DateTimeFormatOptions): string {
  if (date.getFullYear() === now.getFullYear()) {
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

export function useShortDate(date: Date): string {
  const now = useNow();
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();

  // Use en-US and UTC for the first render so we're consistent between SSR and the
  // first client-side render. Then immediately swap in client local.
  const locale = isFirstRenderFromSSR ? 'en-US' : undefined;

  // Similarly, use UTC for the first render then fall back to client time zone.
  const formatOptions: Intl.DateTimeFormatOptions = useMemo(() => ({
    timeZone: isFirstRenderFromSSR ? 'utc' : undefined,
  }), [isFirstRenderFromSSR]);

  if (!isFirstRenderFromSSR && isSameDay(date, now)) {
    return 'Today'
  }
  if (!isFirstRenderFromSSR && isSameDay(date, subDays(now, 1))) {
    return 'Yesterday'
  }

  return shortDate(date, now, locale, formatOptions);
}

/**
 * Delays image URLs until the image has been loaded once (and thus is cached).
 *
 * In the case on an error, any previous URL will continue to be returned, as
 * well as the `failed` (until a subsequent load succeeded).
 */
export function useImageUrlOnceLoaded<T extends (string | undefined)>(url: T): { url: T | undefined, loading: boolean, failed: boolean} {
  const [loadedUrl, setLoadedUrl] = useState<T | undefined>(undefined);
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

  useEffect(() => {
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
