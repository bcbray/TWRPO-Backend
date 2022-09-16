import React from 'react';
import { VideoSegment, Streamer } from '@twrpo/types';

import StreamCard from './StreamCard';
import PastStreamCard from './PastStreamCard';

interface VideoSegmentCardProps {
  className?: string;
  streamer: Streamer;
  segment: VideoSegment;
  loadTick?: number;
  embed?: boolean | 'hover';
  hideStreamer?: boolean;
  wrapTitle?: boolean;
  noEdit?: boolean;
  pastStreamStyle?: 'vivid' | 'blurred' | 'dimmed';
  canShowLiveBadge?: boolean;
  handleRefresh: () => void;
}

const VideoSegmentCard = React.forwardRef<HTMLDivElement, VideoSegmentCardProps>((
  {
    className,
    streamer,
    segment,
    loadTick,
    embed,
    hideStreamer,
    wrapTitle,
    noEdit,
    pastStreamStyle = 'dimmed',
    canShowLiveBadge,
    handleRefresh,
  }, ref
) => {
  if (segment.liveInfo) {
    return (
      <StreamCard
        ref={ref}
        className={className}
        stream={segment.liveInfo}
        loadTick={loadTick}
        embed={embed}
        hideStreamer={hideStreamer}
        wrapTitle={wrapTitle}
        noEdit={noEdit}
        showLiveBadge={canShowLiveBadge}
        handleRefresh={handleRefresh}
      />
    );
  } else {
    return (
      <PastStreamCard
        ref={ref}
        className={className}
        streamer={streamer}
        segment={segment}
        hideStreamer={hideStreamer}
        wrapTitle={wrapTitle}
        noEdit={noEdit}
        thumbnailStyle={pastStreamStyle}
        handleRefresh={handleRefresh}
      />
    );
  }
});

export default VideoSegmentCard;
