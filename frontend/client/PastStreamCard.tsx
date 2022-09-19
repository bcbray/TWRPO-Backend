import React from 'react';
import { Link } from 'react-router-dom';
import { EyeSlashFill } from 'react-bootstrap-icons';
import { VideoSegment, Streamer } from '@twrpo/types';

import styles from './PastStreamCard.module.css';

import { formatDuration, classes } from './utils';
import { useImageUrlOnceLoaded, useRelativeDate } from './hooks';
import { useFactionCss } from './FactionStyleProvider';
import Tag from './Tag';
import ProfilePhotos from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import OverrideSegmentButton from './OverrideSegmentButton';
import SegmentTitleTag from './SegmentTitleTag';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  streamer: Streamer;
  segment: VideoSegment;
  hideStreamer?: boolean;
  wrapTitle?: boolean;
  noEdit?: boolean;
  thumbnailStyle?: 'vivid' | 'blurred' | 'dimmed';
  timeDisplay?: 'end' | 'start';
  handleRefresh: () => void;
}

interface StreamLinkProps {
  streamer: Streamer;
  segment: VideoSegment;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StreamLink: React.FC<StreamLinkProps> = ({ streamer, segment, style, children }) => (
  segment.url
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

const PastStreamCard = React.forwardRef<HTMLDivElement, Props>((
  {
    streamer,
    segment,
    className,
    style,
    hideStreamer = false,
    wrapTitle = false,
    noEdit = false,
    thumbnailStyle = 'dimmed',
    timeDisplay = 'start',
    handleRefresh,
    ...rest
  }, ref
) => {
  const { factionStylesForKey } = useFactionCss();

  const startDate = React.useMemo(() => new Date(segment.startDate), [segment.startDate])
  const endDate = React.useMemo(() => new Date(segment.endDate), [segment.endDate])

  const { full: fullDate, relative: relativeDate } = useRelativeDate(
    timeDisplay === 'start' ? startDate : endDate
  );

  const thumbnailUrl = React.useMemo(() => {
    if (!segment.thumbnailUrl) return undefined;
    return `${
      segment.thumbnailUrl
        ?.replace(/%?{width}/, '440')
        .replace(/%?{height}/, '248')
    }`
  }, [segment.thumbnailUrl]);

  const { url: loadedThumbnailUrl } = useImageUrlOnceLoaded(thumbnailUrl);

  return (
    <div
      className={classes(
        styles.container,
        thumbnailStyle === 'vivid' && styles.vivid,
        thumbnailStyle === 'dimmed' && styles.dimmed,
        thumbnailStyle === 'blurred' && styles.blurred,
        className
      )}
      ref={ref}
      style={{
        ...factionStylesForKey(segment.character?.factions[0]?.key ?? 'otherwrp'),
        ...style
      }}
      {...rest}
    >
      <div
        className={classes(
          styles.thumbnail,
          !segment.url && styles.noLink,
          loadedThumbnailUrl && styles.hasThumbnail
        )}
      >
        <StreamLink streamer={streamer} segment={segment}>
          {loadedThumbnailUrl &&
            <>
              <img
                className={styles.lastStreamThumbnail}
                src={loadedThumbnailUrl}
                alt={`${streamer.displayName} video thumbnail`}
                loading='lazy'
              />
              {thumbnailStyle === 'blurred' &&
                <>
                  <div className={styles.thumbnailBlurOverlay} />
                  <div className={styles.thumbnailColorOverlay} />
                </>
              }
            </>
          }
          {thumbnailStyle === 'blurred' &&
            <>
              <div className={styles.offline}>
                <p>Offline</p>
              </div>
            </>
          }
        </StreamLink>
        {segment.isHidden &&
          <div className={styles.hiddenOverlay}>
            <EyeSlashFill title='Segment is hidden' />
          </div>
        }
        <div className={styles.topTags}>
          <SegmentTitleTag
            className={classes(styles.tag, styles.name)}
            segment={segment}
          />
          {segment.liveInfo &&
            <Tag className={classes(styles.tag, styles.live)}>
              <p>Live</p>
            </Tag>
          }
        </div>
        <Tag className={classes(styles.tag, styles.viewers)}>
          <p title={fullDate}>{relativeDate}</p>
        </Tag>
        <Tag
          className={classes(
            styles.tag,
            styles.runtime,
            segment.isTooShort && styles.tooShort
          )}
          title={segment.isTooShort ? 'Segment is excluded due to being too short' : undefined}
        >
          <p>
            {segment.isTooShort &&
              <span className={styles.icon}>
                <EyeSlashFill />
              </span>
            }
            {formatDuration(startDate, endDate)}
          </p>
        </Tag>
      </div>
      <div className={classes(styles.info, 'stream-card-info')}>
        {!hideStreamer &&
          <Link to={`/streamer/${streamer.twitchLogin}`}>
            <ProfilePhotos
              className={styles.pfp}
              channelInfo={streamer}
              size='sm'
            />
          </Link>
        }
        <div className={styles.text}>
          <div className={classes(styles.title, wrapTitle && styles.wrap)}>
            <p title={segment.title}>{segment.title}</p>
          </div>
          {!hideStreamer &&
            <div className={styles.channel}>
              <p>
                <Link to={`/streamer/${streamer.twitchLogin}`}>
                  {streamer.displayName}
                </Link>
              </p>
            </div>
          }
        </div>
        {!noEdit &&
          <div
              className={styles.editButton}
          >
            <OverrideSegmentButton
              streamerTwitchLogin={streamer.twitchLogin}
              segmentId={segment.id}
              handleRefresh={handleRefresh}
            />
          </div>
        }
      </div>
    </div>
  )
});

export default PastStreamCard;
