import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { useHarmonicIntervalFn } from 'react-use';

import { useLoading, useAutoReloading, LoadingProps, AutoReloadingProps } from './LoadingState';
import { LiveResponse, CharactersResponse } from './types'

export interface PreloadedData {
  now?: Date;
  usedNow?: boolean;

  live?: LiveResponse;
  usedLive?: boolean;

  characters?: CharactersResponse;
  usedCharacters?: boolean;
}

export const preloadedNowKey = '__PRELOADED_NOW__';

export const preloadedLiveDataKey = '__PRELOADED_LIVE_DATA__';
export const preloadedCharacterDataKey = '__PRELOADED_CHARACTERS_DATA__';

export const PreloadedDataContext = React.createContext<PreloadedData>({});

export const ServerPreloadedDataProvider = PreloadedDataContext.Provider;

export const ClientPreloadedDataProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (useIsSSR()) {
    console.error('ClientPreloadedDataProvider should not be used on the server');
  }

  const now = preloadedNowKey in window
    ? new Date((window as any)[preloadedNowKey])
    : undefined;

  const live = preloadedLiveDataKey in window
    ? (window as any)[preloadedLiveDataKey] as LiveResponse
    : undefined;

  const characters = preloadedLiveDataKey in window
    ? (window as any)[preloadedCharacterDataKey] as CharactersResponse
    : undefined;

  return <PreloadedDataContext.Provider value={{ now, live, characters }}>
    {children}
  </PreloadedDataContext.Provider>
}

export const useNow = (intervalMs: number = 1000) => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  preloadedContext.usedNow = true;
  const [now, setNow] = React.useState(preloadedContext.now ?? new Date());
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
