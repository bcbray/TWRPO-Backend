import React from 'react';

import styles from './StreamCard.module.css';
import { Stream, FactionInfo, channelInfo } from './types';
import { formatViewers } from './utils';
import Tag from './Tag';
import ProfilePhotos from './ProfilePhoto';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: Stream;
  factionInfos: {[key: string]: FactionInfo};
}

const StreamCard = React.forwardRef<HTMLDivElement, Props>((
  { stream, factionInfos, className, ...rest }, ref
) => (
  <div className={[styles.card, className].join(' ')} ref={ref} {...rest}>
    <div className={styles.thumbnail}>
      <a
        target='_blank'
        rel='noreferrer'
        href={`https://twitch.tv/${stream.channelName}`}
        style={{
          color: factionInfos[stream.faction]?.colorLight,
        }}
      >
        <img
          src={stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')}
          alt={`${stream.channelName} stream thumbnail`}
          loading='lazy'
        />
      </a>
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
      <a
        target='_blank'
        rel='noreferrer'
        href={`https://twitch.tv/${stream.channelName}`}
      >
        <ProfilePhotos
          className={styles.pfp}
          channelInfo={channelInfo(stream)}
          size='sm'
        />
      </a>
      <div className={styles.text}>
        <div className={styles.title}>
          <p title={stream.title}>{stream.title}</p>
        </div>
        <div className={styles.channel}>
          <p>
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://twitch.tv/${stream.channelName}`}
              style={{
                color: factionInfos[stream.faction]?.colorLight,
              }}
            >
              {stream.channelName}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
));

export default StreamCard;
