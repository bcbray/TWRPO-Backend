import { useState, useEffect } from 'react';
import { useSearchParams, NavigateOptions  } from 'react-router-dom';

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
  const [ratio, setRatio] = useState(isBrowser ? window.devicePixelRatio : fallback);

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
  }, []);

  return ratio;
}
