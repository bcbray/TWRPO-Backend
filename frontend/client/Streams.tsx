import React from 'react';
import { useUpdateEffect } from 'react-use';
import { StreamsResponse } from '@twrpo/types';

import { useStreams, useUnknownStreams, PreLoadingProps, StreamsParams } from './Data';
import { isSuccess, LoadingResult } from './LoadingState';
import StreamList from './StreamList';
import { LoadTrigger, useInitialRender } from './hooks';

interface StreamsProps {
  type?: 'live' | 'unknown'
}

export const usePaginatedStreams = (
  loader: (params: StreamsParams | undefined, props: PreLoadingProps<StreamsResponse>) => LoadingResult<StreamsResponse>,
  params: Omit<StreamsParams, 'cursor'> = {}
) => {
  const [currentCursor, setCurrentCursor] = React.useState<string | undefined>();
  const nextCursorRef = React.useRef<string | undefined>(undefined);
  const hasMoreRef = React.useRef(true);
  const [loadState, reload, loadTick] = loader(
    { ...params, cursor: currentCursor },
    { needsLoad: hasMoreRef.current }
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
      setStreams(streams => [...streams, ...loadState.data.streams]);
    }
  }, [loadState])

  const outerReload = React.useCallback(() => {
    lastRefreshRef.current = undefined;
    nextCursorRef.current = undefined;
    hasMoreRef.current = true;
    setCurrentCursor(undefined);
    setStreams([]);
    reload();
  }, [reload]);

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
  );

  return (
    <div className='content inset'>
      <StreamList
        streams={[]}
        segments={streams}
        loadTick={loadTick}
        paginationKey='live'
        handleRefresh={() => reload}
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
