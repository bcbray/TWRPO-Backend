import React from 'react';

import styles from './StreamCard.module.css';
import { Stream } from './types';
import { formatViewers } from './utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: Stream;
  factionColors: {[key: string]: { dark: string, light: string}};
}

const StreamCard: React.FC<Props> = ({
  stream,
  factionColors,
  className,
  ...rest
}) => {
  return (
    <div className={[styles.card, className].join(' ')} {...rest}>
      <div className={styles.thumbnail}>
        <a
          target='_blank'
          rel='noreferrer'
          href={`https://twitch.tv/${stream.channelName}`}
          style={{
            color: factionColors[stream.faction]?.light,
          }}
        >
          <img
            src={stream.thumbnailUrl?.replace('{width}', '440').replace('{height}', '248')}
            alt={`${stream.channelName} stream thumbnail`}
          />
        </a>
        <div
          className={[styles.tag, styles.name].join(' ')}
          style={{
            background: factionColors[stream.faction]?.dark,
          }}
        >
          <p>{stream.tagText}</p>
        </div>
        <div className={[styles.tag, styles.viewers].join(' ')}>
          <p>{formatViewers(stream.viewers)}</p>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.pfp}>
          <img
            src={stream.profileUrl}
            alt={stream.channelName}
          />
        </div>
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
                  color: factionColors[stream.faction]?.light,
                }}
              >
                {stream.channelName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
