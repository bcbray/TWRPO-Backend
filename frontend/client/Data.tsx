import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { useHarmonicIntervalFn } from 'react-use';
import {
  LiveResponse,
  CharactersResponse,
  FactionsResponse,
  StreamerResponse,
  UnknownResponse,
  UserResponse,
  VideoSegment,
  StreamsResponse,
  ServersResponse,
  ServerResponse,
  UsersResponse,
  ServerBase,
} from '@twrpo/types'

import { useInitialRender } from './hooks';
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
  factions?: Record<string, FactionsResponse>;
  characters?: Record<string, CharactersResponse>;
  streamers?: Record<string, StreamerResponse | null>;
  unknown?: UnknownResponse;
  segments?: Record<number, VideoSegment | null>;
  liveStreams?: StreamsResponse;
  recentStreams?: Record<string, StreamsResponse>;
  streams?: Record<string, StreamsResponse>;
  unknownStreams?: Record<string, StreamsResponse>;
  currentUser?: UserResponse;
  servers?: ServersResponse;
  server?: Record<string, ServerResponse | null>;
  users?: UsersResponse;
  isSSR: boolean;
}

export interface PreloadedUsed {
  usedNow?: boolean;
  usedLive?: boolean;
  usedFactionsQueries?: string[];
  usedCharactersQueries?: string[];
  usedStreamerNames?: string[];
  usedFactionCssServers?: ServerBase[];
  usedUnknown?: boolean;
  usedCurrentUser?: boolean;
  usedSegmentIds?: number[];
  usedLiveStreams?: boolean;
  usedRecentStreamsQueries?: string[];
  usedStreamsQueries?: string[];
  usedUnknownStreamsQueries?: string[];
  usedServers?: boolean;
  usedServerIdentifiers?: string[];
  usedUsers?: boolean;
}

export const preloadedDataKey = '__TWRPO_PRELOADED__';

export const PreloadedDataContext = React.createContext<PreloadedData>({ isSSR: false });

export const PreloadedUsedContext = React.createContext<PreloadedUsed | null>(null);

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

  const { isSSR, ...data } = React.useMemo(() => {
    return preloadedDataKey in window
      ? (window as any)[preloadedDataKey] as PreloadedData
      : { isSSR: false };
  }, []);

  const isFirstRender = useInitialRender();

  return (
    <PreloadedDataContext.Provider value={{ ...data, isSSR: isSSR && isFirstRender }}>
      <PreloadedUsedContext.Provider value={null}>
        {children}
      </PreloadedUsedContext.Provider>
    </PreloadedDataContext.Provider>
  )
}

export const useIsFirstRenderFromSSR = (): boolean => {
  const { isSSR } = React.useContext(PreloadedDataContext);
  return isSSR;
}

export const useNow = (intervalMs: number = 1000): Date => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && !preloadedData.now) {
    preloadedUsed.usedNow = true;
  }
  const isFirstRenderFromSSR = useIsFirstRenderFromSSR();
  const [now, setNow] = React.useState(preloadedData.now && isFirstRenderFromSSR
    ? new Date(JSON.parse(preloadedData.now))
    : new Date());
  useHarmonicIntervalFn(() => setNow(new Date()), intervalMs);
  return now;
};

interface PreLoading {
  skipsPreload?: boolean;
}

export type PreLoadingProps<T> = LoadingProps<T> & PreLoading;

export type PreAutoReloadingProps<T> = AutoReloadingProps<T> & PreLoading;

export interface CharactersParams {
  live?: boolean;
  search?: string;
  factionKey?: string;
  channelTwitchId?: string;
  serverKey?: string;
  serverId?: number;
  tempAllowNoServer?: boolean;
}

const queryStringForCharactersParams = (params: CharactersParams): string => {
  const {
    live,
    search,
    factionKey,
    channelTwitchId,
    serverKey,
    serverId,
    tempAllowNoServer,
  } = params;

  const searchParams = new URLSearchParams();
  if (live !== undefined) {
    searchParams.set('live', live ? 'true' : 'false');
  }
  if (factionKey !== undefined) {
    searchParams.set('factionKey', factionKey);
  }
  if (search !== undefined) {
    searchParams.set('search', search);
  }
  if (channelTwitchId !== undefined) {
    searchParams.set('channelTwitchId', channelTwitchId);
  }
  if (serverKey !== undefined) {
    searchParams.set('serverKey', serverKey);
  }
  if (serverId !== undefined) {
    searchParams.set('serverId', `${serverId|0}`);
  }
  if (tempAllowNoServer !== undefined) {
    searchParams.set('tempAllowNoServer', tempAllowNoServer ? 'true' : 'false');
  }
  return searchParams.toString();
};

export const useCharacters = (params: CharactersParams = {}, { skipsPreload = false, ...props }: PreLoadingProps<CharactersResponse> = {}): LoadingResult<CharactersResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForCharactersParams(params);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.characters?.[query] === undefined) {
    if (preloadedUsed.usedCharactersQueries === undefined) {
      preloadedUsed.usedCharactersQueries = [];
    }
    preloadedUsed.usedCharactersQueries.push(query);
  }

  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/characters${query ? `?${query}` : ''}`, {
    preloaded: skipsPreload ? undefined : preloadedData.characters?.[query],
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.characters === undefined) {
      preloadedData.characters = {};
    }
    preloadedData.characters[query] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export interface FactionsParams {
  serverKey?: string;
  serverId?: number;
  tempAllowNoServer?: boolean;
}

export const queryStringForFactionsParams = (params: FactionsParams): string => {
  const {
    serverKey,
    serverId,
    tempAllowNoServer,
  } = params;

  const searchParams = new URLSearchParams();
  if (serverKey !== undefined) {
    searchParams.set('serverKey', serverKey);
  }
  if (serverId !== undefined) {
    searchParams.set('serverId', `${serverId|0}`);
  }
  if (tempAllowNoServer !== undefined) {
    searchParams.set('tempAllowNoServer', tempAllowNoServer ? 'true' : 'false');
  }
  return searchParams.toString();
};

function useFactionsBase(
  loader: (info: RequestInfo, props: LoadingProps<FactionsResponse>) => LoadingResult<FactionsResponse>,
  params: FactionsParams = {},
  { skipsPreload = false, ...props }: LoadingProps<FactionsResponse> & PreLoading
): LoadingResult<FactionsResponse> {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForFactionsParams(params);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.factions?.[query] === undefined) {
    if (preloadedUsed.usedFactionsQueries === undefined) {
      preloadedUsed.usedFactionsQueries = [];
    }
    preloadedUsed.usedFactionsQueries.push(query);
  }

  const [loadState, outerOnReload, lastLoad] = loader(`/api/v2/factions${query ? `?${query}` : ''}`, {
    preloaded: skipsPreload ? undefined : preloadedData.factions?.[query],
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.factions === undefined) {
      preloadedData.factions = {};
    }
    preloadedData.factions[query] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useFactions = (params: FactionsParams = {}, props: PreLoadingProps<FactionsResponse> = {}): LoadingResult<FactionsResponse> =>
  useFactionsBase(useLoading, params, props);

export const useAutoreloadFactions = (params: FactionsParams = {}, props: PreAutoReloadingProps<FactionsResponse> = {}): LoadingResult<FactionsResponse> =>
  useFactionsBase(useAutoReloading, params, props);

export const useLive = ({ skipsPreload = false, ...props }: PreLoadingProps<LiveResponse> = {}): LoadingResult<LiveResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.live === undefined) {
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
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.live === undefined) {
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
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.streamers?.[nameLower] === undefined) {
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
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.unknown === undefined) {
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

export const useCurrentUser = ({ skipsPreload = false, ...props }: PreLoadingProps<UserResponse> = {}): LoadingResult<UserResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.currentUser === undefined) {
    preloadedUsed.usedCurrentUser = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/whoami', {
    preloaded: skipsPreload ? undefined : preloadedData.currentUser,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.currentUser = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useSegment = (id: number, { skipsPreload = false, ...props }: PreLoadingProps<VideoSegment> = {}): LoadingResult<VideoSegment> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.segments?.[id] === undefined) {
    if (!preloadedUsed.usedSegmentIds) {
      preloadedUsed.usedSegmentIds = [];
    }
    preloadedUsed.usedSegmentIds.push(id);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.segments?.[id];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/segments/${id}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (!preloadedData.segments) {
      preloadedData.segments = {};
    }
    preloadedData.segments[id] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useLiveStreams = ({ skipsPreload = false, ...props }: PreLoadingProps<StreamsResponse> = {}): LoadingResult<StreamsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.liveStreams === undefined) {
    preloadedUsed.usedLiveStreams = true;
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.liveStreams;
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streams/live`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.liveStreams = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export interface StreamsParams {
  live?: boolean;
  distinctCharacters?: boolean;
  search?: string;
  factionKey?: string;
  channelTwitchId?: string;
  serverKey?: string;
  serverId?: number;
  gameKey?: string;
  tempAllowNoServer?: boolean;
  startBefore?: Date;
  startAfter?: Date;
  endBefore?: Date;
  endAfter?: Date;
  limit?: number;
  cursor?: string;
}

const queryStringForStreamsParams = (params: StreamsParams): string => {
  const {
    live,
    distinctCharacters,
    search,
    factionKey,
    channelTwitchId,
    serverKey,
    serverId,
    gameKey,
    tempAllowNoServer,
    startBefore,
    startAfter,
    endBefore,
    endAfter,
    limit,
    cursor,
  } = params;

  const searchParams = new URLSearchParams();
  if (live !== undefined) {
    searchParams.set('live', live ? 'true' : 'false');
  }
  if (distinctCharacters !== undefined) {
    searchParams.set('distinctCharacters', distinctCharacters ? 'true' : 'false');
  }
  if (factionKey !== undefined) {
    searchParams.set('factionKey', factionKey);
  }
  if (search !== undefined) {
    searchParams.set('search', search);
  }
  if (channelTwitchId !== undefined) {
    searchParams.set('channelTwitchId', channelTwitchId);
  }
  if (serverKey !== undefined) {
    searchParams.set('serverKey', serverKey);
  }
  if (serverId !== undefined) {
    searchParams.set('serverId', `${serverId|0}`);
  }
  if (gameKey !== undefined) {
    searchParams.set('gameKey', gameKey);
  }
  if (tempAllowNoServer !== undefined) {
    searchParams.set('tempAllowNoServer', tempAllowNoServer ? 'true' : 'false');
  }
  if (startBefore !== undefined) {
    searchParams.set('startBefore', startBefore.toISOString());
  }
  if (startAfter !== undefined) {
    searchParams.set('startAfter', startAfter.toISOString());
  }
  if (endBefore !== undefined) {
    searchParams.set('endBefore', endBefore.toISOString());
  }
  if (endAfter !== undefined) {
    searchParams.set('endAfter', endAfter.toISOString());
  }
  if (limit !== undefined) {
    searchParams.set('limit', `${limit|0}`);
  }
  if (cursor !== undefined) {
    searchParams.set('cursor', cursor);
  }
  return searchParams.toString();
};

export const useRecentStreams = (params: StreamsParams = {}, { skipsPreload = false, ...props }: PreLoadingProps<StreamsResponse> = {}): LoadingResult<StreamsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForStreamsParams({ tempAllowNoServer: true, ...params });
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.recentStreams?.[query] === undefined) {
    if (preloadedUsed.usedRecentStreamsQueries === undefined) {
      preloadedUsed.usedRecentStreamsQueries = [];
    }
    preloadedUsed.usedRecentStreamsQueries.push(query);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.recentStreams?.[query];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streams/recent${query ? `?${query}` : ''}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.recentStreams === undefined) {
      preloadedData.recentStreams = {};
    }
    preloadedData.recentStreams[query ?? ''] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useStreams = (params: StreamsParams = {}, { skipsPreload = false, ...props }: PreLoadingProps<StreamsResponse> = {}): LoadingResult<StreamsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForStreamsParams({ tempAllowNoServer: true, ...params });
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.streams?.[query] === undefined) {
    if (preloadedUsed.usedStreamsQueries === undefined) {
      preloadedUsed.usedStreamsQueries = [];
    }
    preloadedUsed.usedStreamsQueries.push(query);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.streams?.[query];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streams${query ? `?${query}` : ''}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.streams === undefined) {
      preloadedData.streams = {};
    }
    preloadedData.streams[query] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useUnknownStreams = (params: StreamsParams = {}, { skipsPreload = false, ...props }: PreLoadingProps<StreamsResponse> = {}): LoadingResult<StreamsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForStreamsParams({ tempAllowNoServer: true, ...params });
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.unknownStreams?.[query] === undefined) {
    if (preloadedUsed.usedUnknownStreamsQueries === undefined) {
      preloadedUsed.usedUnknownStreamsQueries = [];
    }
    preloadedUsed.usedUnknownStreamsQueries.push(query);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.unknownStreams?.[query];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streams/unknown${query ? `?${query}` : ''}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.unknownStreams === undefined) {
      preloadedData.unknownStreams = {};
    }
    preloadedData.unknownStreams[query] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useServers = ({ skipsPreload = false, ...props }: PreLoadingProps<ServersResponse> = {}): LoadingResult<ServersResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.servers === undefined) {
    preloadedUsed.usedServers = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/servers', {
    preloaded: skipsPreload ? undefined : preloadedData.servers,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.servers = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useServer = (identifier: string | number, { skipsPreload = false, ...props }: PreLoadingProps<ServerResponse> = {}): LoadingResult<ServerResponse> => {
  const key = typeof identifier === 'string' ? identifier : `${identifier|0}`;
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.server?.[key] === undefined) {
    if (!preloadedUsed.usedServerIdentifiers) {
      preloadedUsed.usedServerIdentifiers = [];
    }
    preloadedUsed.usedServerIdentifiers.push(key);
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.server?.[key];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/servers/${key}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (!preloadedData.server) {
      preloadedData.server = {};
    }
    preloadedData.server[key] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};

export const useUsers = ({ skipsPreload = false, ...props }: PreLoadingProps<UsersResponse> = {}): LoadingResult<UsersResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (preloadedUsed && skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.users === undefined) {
    preloadedUsed.usedUsers = true;
  }
  const [loadState, outerOnReload, lastLoad] = useLoading('/api/v2/users', {
    preloaded: skipsPreload ? undefined : preloadedData.users,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    preloadedData.users = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
};
