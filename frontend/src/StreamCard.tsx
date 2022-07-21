import React from 'react';

import styles from './StreamCard.module.css';
import { Stream, FactionInfo, channelInfo } from './types';
import { formatViewers } from './utils';
import Tag from './Tag';
import ProfilePhotos from './ProfilePhoto';
import OutboundLink from './OutboundLink';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: Stream;
  factionInfos: {[key: string]: FactionInfo};
  loadTick?: number;
}

interface StreamLinkProps {
  stream: Stream;
  style?: React.CSSProperties;
  children: React.ReactNode
}

const StreamLink: React.FC<StreamLinkProps> = ({stream, style, children}) => (
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
  { stream, factionInfos, className, loadTick, ...rest }, ref
) => (
  <div className={[styles.card, className].join(' ')} ref={ref} {...rest}>
    <div className={styles.thumbnail}>
      <StreamLink
        stream={stream}
        style={{
          color: factionInfos[stream.faction]?.colorLight,
        }}
      >
        <img
          src={`${stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')}${loadTick ? `?${loadTick}` : ''}`}
          alt={`${stream.channelName} stream thumbnail`}
          loading='lazy'
        />
      </StreamLink>
      <Tag
        className={[styles.tag, styles.name].join(' ')}
        style={{
          background: factionInfos[stream.faction]?.colorDark,
        }}
      >
        <p>{stream.tagText}</p>
      </Tag>
      <Tag className={[styles.tag, styles.viewers].join(' ')}>
        <p>{formatViewers(stream.viewers)}</p>
      </Tag>
    </div>
    <div className={[styles.info, 'stream-card-info'].join(' ')}>
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
            <StreamLink
              stream={stream}
              style={{
                color: factionInfos[stream.faction]?.colorLight,
              }}
            >
              {stream.channelName}
            </StreamLink>
          </p>
        </div>
      </div>
    </div>
  </div>
));

export default StreamCard;
