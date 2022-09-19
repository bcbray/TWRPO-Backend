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
  segments?: Record<number, VideoSegment | null>;
  liveStreams?: StreamsResponse;
  recentStreams?: Record<string, StreamsResponse>;
  streams?: Record<string, StreamsResponse>;
  unknownStreams?: Record<string, StreamsResponse>;
  currentUser?: UserResponse;
  servers?: ServersResponse;
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
  usedSegmentIds?: number[];
  usedLiveStreams?: boolean;
  usedRecentStreamsQueries?: string[];
  usedStreamsQueries?: string[];
  usedUnknownStreamsCursors?: string[];
  usedServers?: boolean;
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.characters === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.factions === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.factions === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.live === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.live === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.unknown === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.currentUser === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.segments?.[id] === undefined) {
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
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.liveStreams === undefined) {
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
  startBefore?: Date;
  startAfter?: Date;
  endBefore?: Date;
  endAfter?: Date;
  cursor?: string;
}

const queryStringForParams = (params: StreamsParams): string => {
  const {
    live,
    startBefore,
    startAfter,
    endBefore,
    endAfter,
    cursor,
  } = params;

  const searchParams = new URLSearchParams();
  if (live !== undefined) {
    searchParams.set('live', live ? 'true' : 'false');
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
  if (cursor !== undefined) {
    searchParams.set('cursor', cursor);
  }
  return searchParams.toString();
};

export const useRecentStreams = (params: StreamsParams = {}, { skipsPreload = false, ...props }: PreLoadingProps<StreamsResponse> = {}): LoadingResult<StreamsResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  const query = queryStringForParams(params);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.recentStreams?.[query] === undefined) {
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
  const query = queryStringForParams(params);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.streams?.[query] === undefined) {
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
  const { cursor } = params ?? {};

  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.unknownStreams?.[cursor ?? ''] === undefined) {
    if (preloadedUsed.usedUnknownStreamsCursors === undefined) {
      preloadedUsed.usedUnknownStreamsCursors = [];
    }
    preloadedUsed.usedUnknownStreamsCursors.push(cursor ?? '');
  }
  const preloaded = skipsPreload
    ? undefined
    : preloadedData.unknownStreams?.[cursor ?? ''];
  const [loadState, outerOnReload, lastLoad] = useLoading(`/api/v2/streams/unknown${cursor ? `?cursor=${cursor}` : ''}`, {
    preloaded,
    ...props,
  });

  // Update the context so we don't get stuck with stale data later
  if (isSuccess(loadState)) {
    if (preloadedData.unknownStreams === undefined) {
      preloadedData.unknownStreams = {};
    }
    preloadedData.unknownStreams[cursor ?? ''] = loadState.data;
  }

  return [loadState, outerOnReload, lastLoad];
}

export const useServers = ({ skipsPreload = false, ...props }: PreLoadingProps<ServersResponse> = {}): LoadingResult<ServersResponse> => {
  const preloadedData = React.useContext(PreloadedDataContext);
  const preloadedUsed = React.useContext(PreloadedUsedContext);
  if (skipsPreload !== true && props.needsLoad !== false && props.preloaded === undefined && preloadedData.servers === undefined) {
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
