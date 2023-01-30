import React from 'react';
import { VideoSegment, Streamer, FactionInfo } from '@twrpo/types';

import StreamCard from './StreamCard';
import PastStreamCard from './PastStreamCard';

export type CardStyle = 'card' | 'inline';

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
  pastStreamTimeDisplay?: 'start' | 'end';
  canShowLiveBadge?: boolean;
  handleRefresh: () => void;
  cardStyle?: CardStyle;
  factionsByKey: Record<string, FactionInfo>;
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
    pastStreamTimeDisplay = 'start',
    canShowLiveBadge,
    handleRefresh,
    cardStyle,
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
        cardStyle={cardStyle}
        factionsByKey={{}}
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
        timeDisplay={pastStreamTimeDisplay}
        handleRefresh={handleRefresh}
        cardStyle={cardStyle}
      />
    );
  }
});

export default VideoSegmentCard;
