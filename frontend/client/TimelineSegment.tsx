import React from 'react';
import {
  Interval,
  isAfter,
  isBefore,
} from 'date-fns';
import { EyeSlashFill } from 'react-bootstrap-icons';
import { VideoSegment, Streamer } from '@twrpo/types';

import styles from './TimelineSegment.module.css';

import { classes } from './utils';
import { useImageUrlOnceLoaded } from './hooks';
import OverlayTrigger from './OverlayTrigger'
import VideoSegmentCard from './VideoSegmentCard'
import SegmentTitleTag from './SegmentTitleTag'
import Tag from './Tag';
import OutboundLink from './OutboundLink';

interface TimelineSegmentProps {
  segment: VideoSegment;
  streamer: Streamer;
  visibleInterval: Interval;
  pixelsPerSecond: number;
  compact?: boolean;
  handleRefresh: () => void;
  style?: React.CSSProperties;
}

interface StreamLinkProps {
  streamer: Streamer;
  segment: VideoSegment;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StreamLink: React.FC<StreamLinkProps> = ({ streamer, segment, style, children }) => (
  segment.liveInfo
    ? <OutboundLink
        logName={segment.liveInfo.channelName}
        logContext={{
          subtype: 'stream-card',
          isLive: true,
          viewerCount: segment.liveInfo.viewers,
          channel: segment.liveInfo.channelName,
          character: segment.liveInfo.characterName
        }}
        target='_blank'
        rel='noreferrer'
        href={`https://twitch.tv/${streamer.twitchLogin}`}
        style={style}
      >
        {children}
      </OutboundLink>
    : segment.url
      ? <OutboundLink
          logName={streamer.displayName}
          logContext={{
            subtype: 'past-stream-card',
            isLive: true,
            channel: streamer.displayName,
            character: segment.character?.name,
          }}
          target='_blank'
          rel='noreferrer'
          href={segment.url ?? `https://twitch.tv/${streamer.twitchLogin}`}
          style={style}
        >
          {children}
        </OutboundLink>
      : <>{children}</>
);


const TimelineSegment: React.FC<TimelineSegmentProps> = ({
  segment,
  streamer,
  visibleInterval,
  pixelsPerSecond,
  compact,
  handleRefresh,
  ...rest
}) => {
  const streamStart = new Date(segment.startDate);
  const streamEnd = new Date(segment.endDate);

  const thumbnailUrl = React.useMemo(() => {
    const thumbnailUrl = segment.liveInfo?.thumbnailUrl ?? segment.thumbnailUrl;
    if (!thumbnailUrl) return undefined;
    return `${
      thumbnailUrl
        ?.replace(/%?{width}/, '440')
        .replace(/%?{height}/, '248')
    }`
  }, [segment]);

  const { url: loadedThumbnailUrl } = useImageUrlOnceLoaded(thumbnailUrl);
  return (
    <OverlayTrigger
      placement='top-mouse'
      flip
      delay={{ show: 500, hide: 100 }}
      overlay={({ placement, arrowProps, show: _show, popper, ...props }) => (
        <div className={styles.streamPopover} {...props}>
          <VideoSegmentCard
            streamer={streamer}
            segment={segment}
            handleRefresh={handleRefresh}
            cardStyle={'card'}
            pastStreamStyle={'vivid'}
            canShowLiveBadge
            embed
          />
        </div>
      )}
    >
      <div
        className={classes(
          styles.segmentContainer
        )}
        {...rest}
      >
        <StreamLink
          streamer={streamer}
          segment={segment}
        >
          <div
            key={segment.id}
            className={classes(
              styles.segment,
              compact && styles.compact,
              (segment.liveInfo || segment.url) && styles.clickable,
              isBefore(streamStart, visibleInterval.start) && styles.overlapLeft,
              isAfter(streamEnd, visibleInterval.end) && styles.overlapRight,
              segment.liveInfo && styles.live,
              segment.isHidden && styles.hidden,
            )}
          >
            <div className={styles.segmentContent}>
              {(loadedThumbnailUrl || segment.isHidden) &&
                <div className={styles.thumbnail}>
                  {loadedThumbnailUrl &&
                    <img alt='Stream thumbnail' src={loadedThumbnailUrl} />
                  }
                  {segment.isHidden &&
                    <div className={styles.hiddenOverlay}>
                      <EyeSlashFill title='Segment is hidden' />
                    </div>
                  }
                </div>
              }
              <div className={styles.info}>
                <div className={styles.tags}>
                  <SegmentTitleTag className={styles.tag} segment={segment} />
                  {segment.liveInfo &&
                    <Tag className={classes(styles.tag, styles.live)}>
                      <p>Live</p>
                    </Tag>
                  }
                </div>
                <p title={segment.title}>{segment.title}</p>
              </div>
            </div>
          </div>
        </StreamLink>
      </div>
    </OverlayTrigger>
  );
}

export default TimelineSegment;
