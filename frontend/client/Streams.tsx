import React from 'react';
import { useUpdateEffect } from 'react-use';

import { useStreams } from './Data';
import { isSuccess } from './LoadingState';
import StreamList from './StreamList';
import { LoadTrigger, useInitialRender } from './hooks';

interface StreamsProps {

}

const usePaginatedStreams = () => {
  const [currentCursor, setCurrentCursor] = React.useState<string | undefined>();
  const nextCursorRef = React.useRef<string | undefined>(undefined);
  const hasMoreRef = React.useRef(true);
  const [loadState, reload, loadTick] = useStreams(
    currentCursor,
    { needsLoad: hasMoreRef.current }
  );
  const isInitialRender = useInitialRender();

  const [streams, setStreams] = React.useState(
    isInitialRender && isSuccess(loadState)
      ? loadState.data.streams
      : []
  );

  if (isInitialRender && isSuccess(loadState)) {
    nextCursorRef.current = loadState.data.nextCursor;
    hasMoreRef.current = loadState.data.nextCursor !== undefined;
  }

  useUpdateEffect(() => {
    if (isSuccess(loadState)) {
      nextCursorRef.current = loadState.data.nextCursor;
      hasMoreRef.current = loadState.data.nextCursor !== undefined;
      setStreams(streams => [...streams, ...loadState.data.streams]);
    }
  }, [loadState])

  const outerReload = React.useCallback(() => {
    nextCursorRef.current = undefined;
    hasMoreRef.current = true;
    setCurrentCursor(undefined);
    reload();
  }, [reload]);

  const loadMore = React.useCallback(() => {
    if (nextCursorRef.current) {
      setCurrentCursor(nextCursorRef.current);
    }
  }, []);

  return {
    streams,
    reload: outerReload,
    loadTick,
    hasMore: hasMoreRef.current,
    loadMore,
    loadKey: nextCursorRef.current ?? '',
  };
}

const Streams: React.FC<StreamsProps> = () => {
  const {
    streams,
    reload,
    loadTick,
    hasMore,
    loadMore,
    loadKey,
  } = usePaginatedStreams();

  return (
    <div className='content inset'>
      <StreamList
        streams={[]}
        segments={streams}
        loadTick={loadTick}
        paginationKey='live'
        handleRefresh={() => reload}
        pastStreamStyle='blurred'
        pastStreamTimeDisplay='end'
        isLoadingMore={hasMore}
        loadMoreTrigger={
          streams.length > 0 && hasMore
            ? <LoadTrigger key={loadKey} loadMore={loadMore} />
            : undefined
        }
      />
    </div>
  );
};

export default Streams;
