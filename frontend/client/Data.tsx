import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { useHarmonicIntervalFn } from 'react-use';
import {
  LiveResponse,
  CharactersResponse,
  FactionsResponse,
  StreamerResponse,
  UnknownResponse,
  User,
} from '@twrpo/types'

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
  live?: LiveResponse;
  factions?: FactionsResponse;
  characters?: CharactersResponse;
  streamers?: Record<string, StreamerResponse | null>;
  unknown?: UnknownResponse;
  currentUser?: User | null;
}

export interface PreloadedUsed {
  usedNow?: boolean;
  usedLive?: boolean;
  usedFactions?: boolean;
  usedCharacters?: boolean;
  usedStreamerNames?: string[];
  usedFactionCss?: boolean;
  usedUnknown?: boolean;
  usedCurrentUser?: boolean;
}

export const preloadedDataKey = '__TWRPO_PRELOADED__';

export const PreloadedDataContext = React.createContext<PreloadedData>({});

export const PreloadedUsedContext = React.createContext<PreloadedUsed>({});

export const ServerPreloadedDataProvider: React.FC<{
  data: PreloadedData,
  used: PreloadedUsed,
  children: React.ReactElement
}>  = ({
  data,
  used,
  children,
}) => (
  <PreloadedDataContext.Provider value={data}>
    <PreloadedUsedContext.Provider value={used}>
      {children}
    </PreloadedUsedContext.Provider>
  </PreloadedDataContext.Provider>
);

export const ClientPreloadedDataProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (useIsSSR()) {
    console.error('ClientPreloadedDataProvider should not be used on the server');
  }

  const data = React.useMemo(() => {
    return preloadedDataKey in window
      ? (window as any)[preloadedDataKey] as PreloadedData
      : {};
  }, []);

  return (
    <PreloadedDataContext.Provider value={data}>
      <PreloadedUsedContext.Provider value={{}}>
        {children}
      </PreloadedUsedContext.Provider>
    </PreloadedDataContext.Provider>
  )
}

export const useNow = (intervalMs: number = 1000): Date => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (!preloadedData.now) {
    preloadedUsed.usedNow = true;
  }
  const [now, setNow] = React.useState(preloadedData.now
    ? new Date(JSON.parse(preloadedData.now))
    : new Date());
  React.useEffect(() => setNow(new Date()), []);
  useHarmonicIntervalFn(() => setNow(new Date()), intervalMs);
  return now;
};

export interface PreLoadingProps<T> extends LoadingProps<T> {
  skipsPreload?: boolean;
}

export interface PreAutoReloadingProps<T> extends AutoReloadingProps<T> {
  skipsPreload?: boolean;
}

export const useCharacters = ({ skipsPreload = false, ...props }: PreLoadingProps<CharactersResponse> = {}): LoadingResult<CharactersResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.characters) {
    preloadedUsed.usedCharacters = true;
  }

  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/characters', {
    preloaded: skipsPreload ? undefined : preloadedData.characters,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.characters = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useFactions = ({ skipsPreload = false, ...props }: PreLoadingProps<FactionsResponse> = {}): LoadingResult<FactionsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.factions) {
    preloadedUsed.usedFactions = true;
  }

  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/factions', {
    preloaded: skipsPreload ? undefined : preloadedData.factions,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.factions = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useAutoreloadFactions = ({ skipsPreload = false, ...props }: PreAutoReloadingProps<FactionsResponse> = {}): LoadingResult<FactionsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.factions) {
    preloadedUsed.usedFactions = true;
  }

  const [loadState, outerOnReload, lastLoad] = useAutoReloading('/api/v2/factions', {
    preloaded: skipsPreload ? undefined :  preloadedData.factions,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.factions = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useLive = ({ skipsPreload = false, ...props }: PreLoadingProps<LiveResponse> = {}): LoadingResult<LiveResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.live) {
    preloadedUsed.usedLive = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v1/live', {
    preloaded: skipsPreload ? undefined : preloadedData.live,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.live = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useAutoreloadLive = ({ skipsPreload = false, ...props }: PreAutoReloadingProps<LiveResponse> = {}): LoadingResult<LiveResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.live) {
    preloadedUsed.usedLive = true;
  }
  const [loadState, outerOnReload, lastLoad] = useAutoReloading('/api/v1/live', {
    preloaded: skipsPreload ? undefined :  preloadedData.live,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.live = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useStreamer = (name: string, { skipsPreload = false, ...props }: PreLoadingProps<StreamerResponse> = {}): LoadingResult<StreamerResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const nameLower = React.useMemo(() => name.toLowerCase(), [name]);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.streamers?.[nameLower] === undefined) {
    if (!preloadedUsed.usedStreamerNames) {
      preloadedUsed.usedStreamerNames = [];
    }
    preloadedUsed.usedStreamerNames.push(nameLower);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.streamers?.[nameLower];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streamers/${name}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (!preloadedData.streamers) {
      preloadedData.streamers = {};
    }
    preloadedData.streamers[nameLower] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useUnknown = ({ skipsPreload = false, ...props }: PreLoadingProps<UnknownResponse> = {}): LoadingResult<UnknownResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.unknown) {
    preloadedUsed.usedUnknown = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/unknown', {
    preloaded: skipsPreload ? undefined : preloadedData.unknown,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.unknown = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useCurrentUser = ({ skipsPreload = false, ...props }: PreLoadingProps<User> = {}): LoadingResult<User> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && !preloadedData.currentUser) {
    preloadedUsed.usedCurrentUser = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/admin/users/me', {
    preloaded: skipsPreload ? undefined : preloadedData.currentUser,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.currentUser = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};
