import React from 'react';

import styles from './OfflineCharacterCard.module.css';
import { CharacterInfo, FactionInfo } from './types';
import { classes } from './utils';
import { useFactionCss, factionStylesForKey } from './hooks';
import Tag from './Tag';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: CharacterInfo;
  factionInfos: {[key: string]: FactionInfo};
}

interface CharacterLinkProps {
  character: CharacterInfo;
  style?: React.CSSProperties;
  children: React.ReactNode
}

const CharacterLink: React.FC<CharacterLinkProps> = ({character, style, children}) => (
  <OutboundLink
    logName={character.channelName}
    logContext={{
      subtype: 'offline-character-card',
      isLive: false,
      channel: character.channelName,
      character: character.name
    }}
    target='_blank'
    rel='noreferrer'
    href={`https://twitch.tv/${character.channelName}`}
    style={style}
  >
    {children}
  </OutboundLink>
);

const OfflineCharacterCard = React.forwardRef<HTMLDivElement, Props>((
  { character, factionInfos, className, style, ...rest }, ref
) => {
  const factionContainer = useFactionCss(Object.values(factionInfos));

  return (
    <div
      className={classes(styles.card, className, factionContainer)}
      ref={ref}
      style={{
        ...factionStylesForKey(character.factions[0]?.key),
        ...style
      }}
      {...rest}
    >
      <div className={styles.thumbnail}>
        <CharacterLink character={character}>
          <span>Offline</span>
        </CharacterLink>
        <Tag className={classes(styles.tag, styles.name)}>
          <p>{character.displayInfo.displayName}</p>
        </Tag>
      </div>
      <div className={classes(styles.info, 'stream-card-info')}>
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
              <CharacterLink character={character}>
                {character.channelName}
              </CharacterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OfflineCharacterCard;
