import React from 'react';
import { useIntersection, useHoverDirty } from 'react-use';
import { Link } from 'react-router-dom';
import { EyeSlashFill } from 'react-bootstrap-icons';
import { Stream, FactionInfo } from '@twrpo/types';

import styles from './StreamCard.module.css';
import { channelInfo } from './types';
import { formatViewers, formatInterval, classes } from './utils';
import {
  useOneWayBoolean,
  useDelayed,
  useWindowFocus,
  useUpdatedImageUrlOnceLoaded,
} from './hooks';
import { useAuthorization } from './auth';
import { useFactionCss } from './FactionStyleProvider';
import { useNow } from './Data';
import ProfilePhotos from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import TwitchEmbed from './TwitchEmbed';
import Crossfade from './Crossfade';
import OverrideSegmentButton from './OverrideSegmentButton'
import StreamTagOverlay, { usePrimaryTagsForStream } from './StreamTagOverlay';

const cardStyles = {
  inline: styles.inline,
  card: styles.card,
}

type CardStyle = keyof typeof cardStyles;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: Stream;
  loadTick?: number;
  cardStyle?: CardStyle;
  embed?: boolean | 'hover';
  hideStreamer?: boolean;
  wrapTitle?: boolean;
  showLiveBadge?: boolean;
  noEdit?: boolean;
  handleRefresh: () => void;
  factionsByKey: Record<string, FactionInfo>;
  onSelectFaction?: (faction: FactionInfo) => void;
}

interface StreamLinkProps {
  stream: Stream;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StreamLink: React.FC<StreamLinkProps> = ({ stream, style, children }) => (
  <OutboundLink
    logName={stream.channelName}
    logContext={{
      subtype: 'stream-card',
      isLive: true,
      viewerCount: stream.viewers,
      channel: stream.channelName,
      character: stream.characterName
    }}
    target='_blank'
    rel='noreferrer'
    href={`https://twitch.tv/${stream.channelName}`}
    style={style}
  >
    {children}
  </OutboundLink>
);

const StreamCard = React.forwardRef<HTMLDivElement, Props>((
  {
    stream,
    className,
    loadTick,
    style,
    cardStyle = 'inline',
    embed = false,
    hideStreamer = false,
    wrapTitle = false,
    showLiveBadge = false,
    noEdit = false,
    handleRefresh,
    factionsByKey,
    onSelectFaction,
    ...rest
  }, ref
) => {
  const { factionStylesForKey } = useFactionCss();
  const thumbnailRef = React.useRef(null);
  const intersection = useIntersection(thumbnailRef, {});

  const [embedIsPlaying, setEmbedPlaying] = React.useState(false);

  const embedHasEverPlayed = useOneWayBoolean(embedIsPlaying);

  const instantHovered = useHoverDirty(thumbnailRef);
  const hovered = useDelayed(instantHovered, embedHasEverPlayed ? 0 : 250);

  const windowFocused = useWindowFocus();

  const isInViewport = intersection != null && intersection.isIntersecting;

  const hasEmbed = (embed === true && isInViewport)
    || (embed === 'hover' && hovered && windowFocused);

  const hasEverHadEmbed = useOneWayBoolean(hasEmbed);


  const hideEmbed = (embed === 'hover' && !embedIsPlaying) || !embedHasEverPlayed;

  const startDate = React.useMemo(() => new Date(stream.startDate), [stream.startDate])

  const now = useNow();

  const thumbnailUrl = React.useMemo(() => {
    if (!stream.thumbnailUrl) return undefined;
    return `${
      stream.thumbnailUrl
        ?.replace('{width}', '440')
        .replace('{height}', '248')
    }${loadTick ? `?${loadTick}` : ''}`
  }, [stream.thumbnailUrl, loadTick]);

  const { url: loadedThumbnailUrl } = useUpdatedImageUrlOnceLoaded(thumbnailUrl);

  const canEdit = useAuthorization({
    type: 'overide-segment',
    twitchId: stream.channelName.toLowerCase(),
  });

  const factions = React.useMemo(() => (
    stream.factions.map(f => factionsByKey[f]).filter(f => f)
  ), [stream.factions, factionsByKey]);

  const nameTags = usePrimaryTagsForStream(stream, factions, onSelectFaction);

  return (
    <div
      className={classes(styles.container, className, cardStyles[cardStyle])}
      ref={ref}
      style={{
        ...factionStylesForKey(stream.tagFaction),
        ...style
      }}
      {...rest}
    >
      <div className={styles.thumbnail} ref={thumbnailRef}>
        <StreamLink stream={stream}>
          <Crossfade fadeKey={loadedThumbnailUrl} fadeOver>
            <img
              src={loadedThumbnailUrl}
              alt={`${stream.channelName} stream thumbnail`}
              loading='lazy'
            />
          </Crossfade>
          {hasEverHadEmbed &&
            <TwitchEmbed
              id={`${stream.channelName.toLowerCase()}-twitch-preview`}
              className={classes(hideEmbed && styles.hidden)}
              channel={stream.channelName}
              width='100%'
              height='100%'
              muted
              controls={false}
              autoplay={false}
              play={hasEmbed}
              onPlaying={setEmbedPlaying}
            />}
        </StreamLink>
        <StreamTagOverlay
          className={styles.tagOverlay}
          topLeft={nameTags}
          bottomLeft={[
            { type: 'secondary', key: 'viewers', text: formatViewers(stream.viewers) },
          ]}
          bottomRight={[
            { type: 'secondary', key: 'duration', text: formatInterval(startDate, now) },
          ]}
        />
        {stream.isHidden &&
          <div className={styles.hiddenOverlay}>
            <EyeSlashFill />
          </div>
        }
      </div>
      <div className={classes(styles.info, 'stream-card-info')}>
        {!hideStreamer &&
          <Link to={`/streamer/${stream.channelName.toLowerCase()}`}>
            <ProfilePhotos
              className={styles.pfp}
              channelInfo={channelInfo(stream)}
              size='sm'
            />
          </Link>
        }
        <div className={styles.text}>
          <div className={classes(styles.title, wrapTitle && styles.wrap)}>
            <p title={stream.title}>{stream.title}</p>
          </div>
          {!hideStreamer &&
            <div className={styles.channel}>
              <p>
                <Link to={`/streamer/${stream.channelName.toLowerCase()}`}>
                  {stream.channelName}
                </Link>
              </p>
            </div>
          }
        </div>
        {stream.segmentId && canEdit && !noEdit &&
          <div
              className={styles.editButton}
          >
            <OverrideSegmentButton
              streamerTwitchLogin={stream.channelName.toLowerCase()}
              segmentId={stream.segmentId}
              handleRefresh={handleRefresh}
            />
          </div>
        }
      </div>
    </div>
  )
});

export default StreamCard;
