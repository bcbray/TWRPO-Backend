import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUpdateEffect, useDeepCompareEffect, useFirstMountState } from 'react-use';
import { StreamsResponse, FactionInfo } from '@twrpo/types';

import { useStreams, useFactions, useUnknownStreams, PreLoadingProps, StreamsParams } from './Data';
import { isSuccess, LoadingResult } from './LoadingState';
import StreamList from './StreamList';
import {
  useSingleSearchParam,
  useDebouncedValue,
  LoadTrigger,
  useInitialRender,
} from './hooks';
import FilterBar from './FilterBar'
import { useCurrentServer } from './CurrentServer';

interface StreamsProps {
  type?: 'live' | 'unknown'
}

export const usePaginatedStreams = (
  loader: (params: StreamsParams | undefined, props: PreLoadingProps<StreamsResponse>) => LoadingResult<StreamsResponse>,
  params: Omit<StreamsParams, 'cursor'> = {},
  { needsLoad: propsNeedsLoad = true, ...props}: PreLoadingProps<StreamsResponse> = {}
) => {
  const [usedParams, setUsedParams] = React.useState(params);
  const [currentCursor, setCurrentCursor] = React.useState<string | undefined>();
  const nextCursorRef = React.useRef<string | undefined>(undefined);
  const hasMoreRef = React.useRef(true);
  const resetOnNextLoadRef = React.useRef(false);
  const [loadState, reload, loadTick] = loader(
    { ...usedParams, cursor: currentCursor },
    { ...props, needsLoad: propsNeedsLoad && hasMoreRef.current }
  );
  const isInitialRender = useInitialRender();

  const [streams, setStreams] = React.useState(
    isInitialRender && isSuccess(loadState)
      ? loadState.data.streams
      : []
  );

  const lastRefreshRef = React.useRef(
    isInitialRender && isSuccess(loadState)
      ? new Date(loadState.data.lastRefreshTime)
      : undefined
  );

  if (isInitialRender && isSuccess(loadState)) {
    nextCursorRef.current = loadState.data.nextCursor;
    hasMoreRef.current = loadState.data.nextCursor !== undefined;
  }

  useUpdateEffect(() => {
    if (isSuccess(loadState)) {
      if (lastRefreshRef.current === undefined) {
        lastRefreshRef.current = new Date(loadState.data.lastRefreshTime);
      }
      nextCursorRef.current = loadState.data.nextCursor;
      hasMoreRef.current = loadState.data.nextCursor !== undefined;
      if (resetOnNextLoadRef.current) {
        setStreams(loadState.data.streams);
      } else {
        setStreams(streams => [...streams, ...loadState.data.streams]);
      }
      resetOnNextLoadRef.current = false;
    }
  }, [loadState])

  const reset = React.useCallback(() => {
    resetOnNextLoadRef.current = true;
    lastRefreshRef.current = undefined;
    nextCursorRef.current = undefined;
    hasMoreRef.current = true;
    setCurrentCursor(undefined);
  }, []);

  const isFirstMount = useFirstMountState();

  useDeepCompareEffect(() => {
    if (!isFirstMount) {
      reset();
      setUsedParams(params);
    }
  }, [params]);

  const outerReload = React.useCallback(() => {
    reset();
    reload();
  }, [reset, reload]);

  const loadMore = React.useCallback(() => {
    if (nextCursorRef.current) {
      setCurrentCursor(nextCursorRef.current);
    }
  }, []);

  return {
    streams,
    lastRefresh: lastRefreshRef.current,
    reload: outerReload,
    loadTick,
    hasMore: hasMoreRef.current,
    loadMore,
    loadKey: nextCursorRef.current ?? '',
  };
}

const Streams: React.FC<StreamsProps> = ({
  type = 'live',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText.trim(), 200);
  const { server } = useCurrentServer();

  const {
    streams,
    reload,
    loadTick,
    hasMore,
    loadMore,
    loadKey,
  } = usePaginatedStreams(
    type === 'live'
      ? useStreams
      : useUnknownStreams,
    {
      search: debouncedFilterText.length > 0 ? debouncedFilterText : undefined,
      factionKey,
      serverId: server.id,
    }
  );

  const search = React.useCallback((text: string) => {
    setFilterText(text, { replace: true });
  }, [setFilterText]);

  const selectFaction = React.useCallback((faction: FactionInfo | null) => {
    navigate(`/utils/streams${faction ? `/faction/${faction.key}` : ''}${location.search}`);
  }, [navigate, location.search]);


  // TODO: Update with live count somehow (auto-reload or pull from streams response)
  const [factionLoadState] = useFactions();

  const factionInfos = React.useMemo(() => (
    isSuccess(factionLoadState)
      ? factionLoadState.data.factions
      : []
  ), [factionLoadState]);

  const filterFactions = React.useMemo(() => (
    [...factionInfos]
      .filter(f => f.hasCharacters === true)
      .filter(f => f.hideInFilter !== true)
      .sort((lhs, rhs) => {
        if (lhs.isLive === rhs.isLive) return 0;
        if (lhs.isLive) return -1;
        return 1;
      })
  ), [factionInfos]);

  const selectedFaction = React.useMemo(() => (
    factionKey ? factionInfos.find(f => f.key === factionKey) : undefined
  ), [factionKey, factionInfos]);

  return (
    <div className='content inset'>
      <FilterBar
        factions={filterFactions}
        selectedFaction={selectedFaction}
        onSelectFaction={selectFaction}
        searchText={filterText}
        onChangeSearchText={search}
        allHref={'/'}
        factionHref={(f) => `/utils/streams/faction/${f.key}`}
        noInset
      />
      <StreamList
        streams={[]}
        segments={streams}
        loadTick={loadTick}
        paginationKey='live'
        handleRefresh={reload}
        pastStreamStyle={
          type === 'live'
            ? 'blurred'
            : 'vivid'
        }
        showLiveBadge={type === 'unknown'}
        pastStreamTimeDisplay='end'
        isLoadingMore={hasMore}
        loadMoreTrigger={
          streams.length > 0 && hasMore
            ? <LoadTrigger key={loadKey} loadMore={loadMore} />
            : undefined
        }
        noInset
      />
    </div>
  );
};

export default Streams;
