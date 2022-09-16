import React from 'react';
import { SegmentAndStreamer } from '@twrpo/types';

import { useStreams } from './Data';
import { isSuccess } from './LoadingState';
import StreamList from './StreamList';
import { LoadTrigger } from './hooks';

interface StreamsProps {

}

const usePaginatedStreams = () => {
  const [streams, setStreams] = React.useState<SegmentAndStreamer[]>([]);
  const [currentCursor, setCurrentCursor] = React.useState<string | undefined>();
  const [nextCursor, setNextCursor] = React.useState<string | undefined>();
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [loadState, reload, loadTick] = useStreams(
    currentCursor,
    { needsLoad: hasMore }
  );

  React.useEffect(() => {
    if (isSuccess(loadState)) {
      setStreams(streams => [...streams, ...loadState.data.streams]);
      setNextCursor(loadState.data.nextCursor);
      setHasMore(loadState.data.nextCursor !== undefined);
    }
  }, [loadState])

  const outerReload = React.useCallback(() => {
    setCurrentCursor(undefined);
    setNextCursor(undefined);
    setHasMore(true);
    reload();
  }, [reload]);

  const loadMore = React.useCallback(() => {
    if (nextCursor) {
      setCurrentCursor(nextCursor);
    }
  }, [nextCursor]);

  return {
    streams,
    reload: outerReload,
    loadTick,
    hasMore,
    loadMore,
    loadKey: nextCursor ?? '',
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
