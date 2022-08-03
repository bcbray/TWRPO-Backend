import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, NavigateOptions  } from 'react-router-dom';
import { useCss } from 'react-use';

import tinycolor from 'tinycolor2';

import { FactionInfo } from './types';

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

export const useFactionCss = (factions: FactionInfo[]) => {
  const styles = useMemo(() => {
    return {
      '--faction-color-fallback-light': '#12af7e',
      '--faction-color-fallback-dark': '#32ff7e',
      '--faction-color-fallback-light-hover': tinycolor('#12af7e').darken().toString(),
      '--faction-color-fallback-dark-hover': tinycolor('#32ff7e').darken().toString(),
      ...Object.fromEntries(factions.flatMap(faction => [
        [
          `--faction-color-light-${faction.key}`,
          faction.colorLight,
        ],
        [
          `--faction-color-light-${faction.key}-hover`,
          tinycolor(faction.colorLight).darken().toString(),
        ],
        [
          `--faction-color-dark-${faction.key}`,
          faction.colorDark,
        ],
        [
          `--faction-color-dark-${faction.key}-hover`,
          tinycolor(faction.colorDark).darken().toString(),
        ],
      ]))
    }
  }, [factions]);

  return useCss(styles);
}


export const factionStyles = (faction: FactionInfo) => factionStylesForKey(faction.key);

export const factionStylesForKey = (key?: string): React.CSSProperties => {
  if (key) {
    return {
      '--faction-color-light': `var(--faction-color-light-${key}, var(--faction-color-fallback-light))`,
      '--faction-color-dark': `var(--faction-color-dark-${key}, var(--faction-color-fallback-dark))`,
      '--faction-color-light-hover': `var(--faction-color-light-${key}-hover, var(--faction-color-fallback-light-hover))`,
      '--faction-color-dark-hover': `var(--faction-color-dark-${key}-hover, var(--faction-color-fallback-dark-hover))`,
    } as React.CSSProperties;
  } else {
    return {
      '--faction-color-light': `var(--faction-color-fallback-light)`,
      '--faction-color-dark': `var(--faction-color-fallback-dark)`,
      '--faction-color-light-hover': `var(--faction-color-fallback-light-hover)`,
      '--faction-color-dark-hover': `var(--faction-color-fallback-dark-hover)`,
    } as React.CSSProperties;
  }

};


export function useWrappedRefWithWarning(ref: any, componentName: any): any {
  // Yeahhh... about that warning...
  return ref;
}
