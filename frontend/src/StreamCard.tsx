import React from 'react';

import styles from './StreamCard.module.css';
import { Stream, FactionInfo, channelInfo } from './types';
import { formatViewers, classes } from './utils';
import { useFactionCss, factionStylesForKey } from './hooks';
import Tag from './Tag';
import ProfilePhotos from './ProfilePhoto';
import OutboundLink from './OutboundLink';

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
    ...rest
  }, ref
) => {
  const factionContainer = useFactionCss(Object.values(factionInfos));

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
      <div className={styles.thumbnail}>
        <StreamLink stream={stream}>
          <img
            src={`${stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')}${loadTick ? `?${loadTick}` : ''}`}
            alt={`${stream.channelName} stream thumbnail`}
            loading='lazy'
          />
        </StreamLink>
        <Tag className={classes(styles.tag, styles.name)}>
          <p>{stream.tagText}</p>
        </Tag>
        <Tag className={classes(styles.tag, styles.viewers)}>
          <p>{formatViewers(stream.viewers)}</p>
        </Tag>
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
