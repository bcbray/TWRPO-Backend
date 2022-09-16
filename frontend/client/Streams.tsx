import React from 'react';
import { SegmentAndStreamer } from '@twrpo/types';

import { useLiveStreams, useRecentStreams } from './Data';
import { isSuccess } from './LoadingState';
import StreamList from './StreamList';
import { LoadTrigger } from './hooks';

interface StreamsProps {

}

const usePaginatedRecentStreams = () => {
  const [streams, setStreams] = React.useState<SegmentAndStreamer[]>([]);
  const [currentCursor, setCurrentCursor] = React.useState<string | undefined>();
  const [nextCursor, setNextCursor] = React.useState<string | undefined>();
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [loadState, reload, loadTick] = useRecentStreams(
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
  const [liveLoadState, reloadLive, liveLoadTick] = useLiveStreams();
  const {
    streams: recent,
    reload: reloadRecent,
    loadTick: recentLoadTick,
    hasMore: recentHasMore,
    loadMore: loadMoreRecent,
    loadKey: recentLoadKey,
  } = usePaginatedRecentStreams();

  const live = isSuccess(liveLoadState) ? liveLoadState.data.streams : [];
  return (
    <div className='content inset'>
      <StreamList
        streams={[]}
        segments={[...live, ...recent]}
        loadTick={liveLoadTick + recentLoadTick}
        paginationKey={'live'}
        handleRefresh={() => {
          reloadLive();
          reloadRecent();
        }}
        isLoadingMore={recentHasMore}
        loadMoreTrigger={
          isSuccess(liveLoadState) && recent.length > 0 && recentHasMore
            ? <LoadTrigger key={recentLoadKey} loadMore={loadMoreRecent} />
            : undefined
        }
      />
    </div>
  );
};

export default Streams;
