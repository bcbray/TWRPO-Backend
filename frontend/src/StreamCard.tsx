import React from 'react';
import { useIntersection, useHoverDirty, useHarmonicIntervalFn } from 'react-use';

import styles from './StreamCard.module.css';
import { Stream, FactionInfo, channelInfo } from './types';
import { formatViewers, formatDuration, classes } from './utils';
import {
  useFactionCss,
  factionStylesForKey,
  useOneWayBoolean,
  useDelayed,
  useWindowFocus
} from './hooks';
import Tag from './Tag';
import ProfilePhotos from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import TwitchEmbed from './TwitchEmbed';

const cardStyles = {
  inline: styles.inline,
  card: styles.card,
}

type CardStyle = keyof typeof cardStyles;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: Stream;
  factionInfos: {[key: string]: FactionInfo};
  loadTick?: number;
  cardStyle?: CardStyle;
  embed?: boolean | 'hover';
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
    factionInfos,
    className,
    loadTick,
    style,
    cardStyle = 'inline',
    embed = false,
    ...rest
  }, ref
) => {
  const factionContainer = useFactionCss(Object.values(factionInfos));
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

  const startDate = React.useMemo(() => {
    return stream.startDate ? new Date(stream.startDate) : undefined;
  }, [stream.startDate])

  const [now, setNow] = React.useState(new Date());
  useHarmonicIntervalFn(() => setNow(new Date()), 1000);

  return (
    <div
      className={classes(styles.container, className, factionContainer, cardStyles[cardStyle])}
      ref={ref}
      style={{
        ...factionStylesForKey(stream.tagFaction),
        ...style
      }}
      {...rest}
    >
      <div className={styles.thumbnail} ref={thumbnailRef}>
        <StreamLink stream={stream}>
          <img
            src={`${stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')}${loadTick ? `?${loadTick}` : ''}`}
            alt={`${stream.channelName} stream thumbnail`}
            loading='lazy'
          />
          {hasEverHadEmbed &&
            <TwitchEmbed
              id={`${stream.channelName.toLowerCase()}-twitch-preview`}
              className={classes(hideEmbed && styles.hidden)}
              channel={stream.channelName}
              width='100%'
              height='100%'
              parent={process.env.REACT_APP_APPLICATION_HOST || 'twrponly.tv'}
              muted
              controls={false}
              autoplay={false}
              play={hasEmbed}
              onPlaying={setEmbedPlaying}
            />}
        </StreamLink>
        <Tag className={classes(styles.tag, styles.name)}>
          <p>{stream.tagText}</p>
        </Tag>
        <Tag className={classes(styles.tag, styles.viewers)}>
          <p>{formatViewers(stream.viewers)}</p>
        </Tag>
        {startDate &&
          <Tag className={classes(styles.tag, styles.runtime)}>
            <p>{formatDuration(startDate, now)}</p>
          </Tag>
        }
      </div>
      <div className={classes(styles.info, 'stream-card-info')}>
        <StreamLink stream={stream}>
          <ProfilePhotos
            className={styles.pfp}
            channelInfo={channelInfo(stream)}
            size='sm'
          />
        </StreamLink>
        <div className={styles.text}>
          <div className={styles.title}>
            <p title={stream.title}>{stream.title}</p>
          </div>
          <div className={styles.channel}>
            <p>
              <StreamLink stream={stream}>
                {stream.channelName}
              </StreamLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
});

export default StreamCard;
