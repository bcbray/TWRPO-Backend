import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { useHarmonicIntervalFn } from 'react-use';

import { useLoading, useAutoReloading, LoadingProps, AutoReloadingProps } from './LoadingState';
import { LiveResponse, CharactersResponse } from './types'

export interface PreloadedData {
  now?: string;
  usedNow?: boolean;

  live?: LiveResponse;
  usedLive?: boolean;

  characters?: CharactersResponse;
  usedCharacters?: boolean;
}

export const preloadedDataKey = '__TWRPO_PRELOADED__';

export const PreloadedDataContext = React.createContext<PreloadedData>({});

export const ServerPreloadedDataProvider = PreloadedDataContext.Provider;

export const ClientPreloadedDataProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (useIsSSR()) {
    console.error('ClientPreloadedDataProvider should not be used on the server');
  }

  const data = React.useMemo(() => {
    return preloadedDataKey in window
      ? (window as any)[preloadedDataKey] as PreloadedData
      : {};
  }, []);

  return <PreloadedDataContext.Provider value={data}>
    {children}
  </PreloadedDataContext.Provider>
}

export const useNow = (intervalMs: number = 1000): Date => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  preloadedContext.usedNow = true;
  const [now, setNow] = React.useState(preloadedContext.now
    ? new Date(preloadedContext.now)
    : new Date());
  useHarmonicIntervalFn(() => setNow(new Date()), intervalMs);
  return now;
};

export const useCharacters = (props: LoadingProps<CharactersResponse> = {}) => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.characters && !props.preloaded) {
    preloadedContext.usedCharacters = true;
  }
  return useLoading('/api/v2/characters', {
    preloaded: preloadedContext.characters,
    ...props,
  });
}

export const useLive = (props: LoadingProps<LiveResponse> = {}) => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.live && !props.preloaded) {
    preloadedContext.usedLive = true;
  }
  return useLoading('/api/v1/live', {
    preloaded: preloadedContext.live,
    ...props,
  });
};

export const useAutoreloadLive = (props: AutoReloadingProps<LiveResponse> = {}) => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.live && !props.preloaded) {
    preloadedContext.usedLive = true;
  }
  return useAutoReloading('/api/v1/live', {
    preloaded: preloadedContext.live,
    ...props,
  });
};
