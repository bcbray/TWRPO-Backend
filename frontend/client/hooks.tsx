import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, NavigateOptions } from 'react-router-dom';
import { useDebounce, usePreviousDistinct, useUpdateEffect } from 'react-use';
import useTimeout from '@restart/hooks/useTimeout';

import { useNow } from './Data';

const isBrowser = typeof window !== 'undefined';

export const useSingleSearchParam = (name: string): [string, ((value: string, options?: NavigateOptions) => void)] => {
  const [params, setParams] = useSearchParams();
  const setParam = (value: string, options?: NavigateOptions) => {
    var newParams = new URLSearchParams(params);
    if (value.length > 0) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setParams(newParams, options);
  }

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

export interface RelativeDateResult {
  full: string;
  relative: string;
}

export function useRelativeDate(date?: Date): RelativeDateResult | undefined {
  const now = useNow();

  const formatter = useMemo(() => new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }), []);

  return useMemo(() => {
    if (!date) return undefined;
    const full = date.toLocaleString();
    let relative: string;
    const diffSeconds = (date.getTime() - now.getTime()) / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    const diffWeeks = diffDays / 7;
     if (diffSeconds > 0) {
      return undefined;
    }
    if (Math.abs(diffMinutes) < 1) {
      relative = 'just now'
    } else if (Math.abs(diffHours) < 1) {
      relative = formatter.format(Math.round(diffMinutes), 'minutes');
    } else if (Math.abs(diffDays) < 1) {
      relative = formatter.format(Math.round(diffHours), 'hours');
    } else if (Math.abs(diffWeeks) < 1) {
      relative = formatter.format(Math.round(diffDays), 'days');
    } else if (Math.abs(diffWeeks) < 2) {
      relative = formatter.format(Math.round(diffWeeks), 'weeks')
    } else if (date.getFullYear() === now.getFullYear()) {
      relative = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    } else {
      relative = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    return { relative, full }
  }, [now, date, formatter]);
}

/**
 * Delays image URLs until the image has been loaded once (and thus is cached).
 * The initial URL will be returned immediately and no pre-loading will occur.
 *
 * In the case on an error, the previous URL will continue to be returned, as
 * well as the `failed` (until a subsequent load succeeded).
 */
export function useImageUrlOnceLoaded<T extends (string | undefined)>(url: T): { url: T, loading: boolean, failed: boolean} {
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
