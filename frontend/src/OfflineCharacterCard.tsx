import React from 'react';

import styles from './OfflineCharacterCard.module.css';
import { CharacterInfo, FactionInfo } from './types';
import Tag from './Tag';
import ProfilePhoto from './ProfilePhoto';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: CharacterInfo;
  factionInfos: {[key: string]: FactionInfo};
}

const OfflineCharacterCard = React.forwardRef<HTMLDivElement, Props>((
  { character, factionInfos, className, ...rest }, ref
) => (
  <div className={[styles.card, className].join(' ')} ref={ref} {...rest}>
    <div className={styles.thumbnail}>
      <a
        target='_blank'
        rel='noreferrer'
        href={`https://twitch.tv/${character.channelName}`}
        style={{
          color: character.factions[0]?.colorLight
        }}
      >
        <span>Offline</span>
      </a>
      <Tag
        className={[styles.tag, styles.name].join(' ')}
        style={{
          background: character.factions[0]?.colorDark,
        }}
      >
        <p>{character.displayInfo.displayName}</p>
      </Tag>
    </div>
    <div className={[styles.info, 'stream-card-info'].join(' ')}>
      <ProfilePhoto
        className={styles.pfp}
        channelInfo={character.channelInfo}
        size={30}
      />
      <div className={styles.text}>
        <div className={styles.title}>
          <p title={character.name}>{character.name}</p>
        </div>
        <div className={styles.channel}>
          <p>
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://twitch.tv/${character.channelName}`}
              style={{
                color: character.factions[0]?.colorLight
              }}
            >
              {character.channelName}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
));

export default OfflineCharacterCard;
