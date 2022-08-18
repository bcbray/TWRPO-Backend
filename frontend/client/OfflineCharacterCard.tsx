import React from 'react';
import { CharacterInfo } from '@twrpo/types';

import styles from './OfflineCharacterCard.module.css';
import { classes } from './utils';
import { useRelativeDate } from './hooks';
import { useFactionCss } from './FactionStyleProvider';
import Tag from './Tag';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: CharacterInfo;
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
  { character, className, style, ...rest }, ref
) => {
  const { factionStylesForKey } = useFactionCss();
  const lastSeenLiveDate = React.useMemo(() => {
    if (!character.lastSeenLive) return undefined;
    const date = new Date(character.lastSeenLive);
    if (isNaN(date.getTime())) return undefined;
    return date;
  }, [character.lastSeenLive]);

  const lastSeenLive = useRelativeDate(lastSeenLiveDate);

  const realName = React.useMemo(() => (
    character.displayInfo.realNames.join(' ')
  ), [character.displayInfo.realNames])

  return (
    <div
      className={classes(styles.card, className)}
      ref={ref}
      style={{
        ...factionStylesForKey(character.factions[0]?.key),
        ...style
      }}
      {...rest}
    >
      <div className={styles.thumbnail}>
        <CharacterLink character={character}>
          <div className={styles.offline}>
            {lastSeenLive &&
            <p
              className={classes(styles.lastSeen, styles.spacer)}
              title={lastSeenLive.full}
            >
              {`Last online ${lastSeenLive.relative}`}
            </p>
          }
            <p>Offline</p>
            {lastSeenLive &&
              <p
                className={styles.lastSeen}
                title={lastSeenLive.full}
              >
                {`Last online ${lastSeenLive.relative}`}
              </p>
            }
          </div>
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
            <p title={realName}>{realName}</p>
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
