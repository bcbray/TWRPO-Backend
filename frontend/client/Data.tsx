import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { useHarmonicIntervalFn } from 'react-use';
import { LiveResponse, CharactersResponse, FactionsResponse } from '@twrpo/types'

import {
  useLoading,
  useAutoReloading,
  LoadingProps,
  AutoReloadingProps,
  isSuccess,
  LoadingResult,
} from './LoadingState';

export interface PreloadedData {
  now?: string;
  usedNow?: boolean;

  live?: LiveResponse;
  usedLive?: boolean;

  factions?: FactionsResponse;
  usedFactions?: boolean;

  characters?: CharactersResponse;
  usedCharacters?: boolean;

  usedFactionCss?: boolean;
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
    ? new Date(JSON.parse(preloadedContext.now))
    : new Date());
  React.useEffect(() => setNow(new Date()), []);
  useHarmonicIntervalFn(() => setNow(new Date()), intervalMs);
  return now;
};

export const useCharacters = (props: LoadingProps<CharactersResponse> = {}): LoadingResult<CharactersResponse> => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.characters && !props.preloaded) {
    preloadedContext.usedCharacters = true;
  }

  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/characters', {
    preloaded: preloadedContext.characters,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedContext.characters = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useFactions = (props: LoadingProps<FactionsResponse> = {}): LoadingResult<FactionsResponse> => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.factions && !props.preloaded) {
    preloadedContext.usedFactions = true;
  }

  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/factions', {
    preloaded: preloadedContext.factions,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedContext.factions = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useLive = (props: LoadingProps<LiveResponse> = {}): LoadingResult<LiveResponse> => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.live && !props.preloaded) {
    preloadedContext.usedLive = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v1/live', {
    preloaded: preloadedContext.live,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedContext.live = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useAutoreloadLive = (props: AutoReloadingProps<LiveResponse> = {}): LoadingResult<LiveResponse> => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.live && !props.preloaded) {
    preloadedContext.usedLive = true;
  }
  const [loadState, outerOnReload, lastLoad] = useAutoReloading('/api/v1/live', {
    preloaded: preloadedContext.live,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedContext.live = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};
