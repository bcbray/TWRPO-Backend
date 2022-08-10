import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, NavigateOptions  } from 'react-router-dom';
import { useDebounce, usePreviousDistinct, useUpdateEffect } from 'react-use';
import useTimeout from '@restart/hooks/useTimeout';

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
