import React from 'react';
import { VideoSegment, Streamer } from '@twrpo/types';

import StreamCard from './StreamCard';
import PastStreamCard from './PastStreamCard';

interface VideoSegmentCardProps {
  streamer: Streamer;
  segment: VideoSegment;
  loadTick?: number;
  embed?: boolean | 'hover';
  hideStreamer?: boolean;
  wrapTitle?: boolean;
  noEdit?: boolean;
  canDim?: boolean;
  canShowLiveBadge?: boolean;
}

const VideoSegmentCard = React.forwardRef<HTMLDivElement, VideoSegmentCardProps>((
  {
    streamer,
    segment,
    loadTick,
    embed,
    hideStreamer,
    wrapTitle,
    noEdit,
    canDim,
    canShowLiveBadge,
  }, ref
) => {
  if (segment.liveInfo) {
    return (
      <StreamCard
        ref={ref}
        stream={segment.liveInfo}
        loadTick={loadTick}
        embed={embed}
        hideStreamer={hideStreamer}
        wrapTitle={wrapTitle}
        showLiveBadge={canShowLiveBadge}
      />
    );
  } else {
    return (
      <PastStreamCard
        ref={ref}
        streamer={streamer}
        segment={segment}
        hideStreamer={hideStreamer}
        wrapTitle={wrapTitle}
        noEdit={noEdit}
        dimmed={canDim}
      />
    );
  }
});

export default VideoSegmentCard;
