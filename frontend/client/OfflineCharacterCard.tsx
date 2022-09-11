import React from 'react';
import { CharacterInfo } from '@twrpo/types';

import styles from './OfflineCharacterCard.module.css';
import { classes } from './utils';
import { useRelativeDate, useImageUrlOnceLoaded } from './hooks';
import { useFactionCss } from './FactionStyleProvider';
import Tag from './Tag';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: CharacterInfo;
  hideStreamer?: boolean;
  wrapTitle?: boolean;
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
    href={character.lastSeenVideoUrl ?? `https://twitch.tv/${character.channelName}`}
    style={style}
  >
    {children}
  </OutboundLink>
);

const OfflineCharacterCard = React.forwardRef<HTMLDivElement, Props>((
  { character, className, style, hideStreamer = false, wrapTitle = false, ...rest }, ref
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

  const lastSeenVideoThumbnailUrl = React.useMemo(() => {
    if (!character.lastSeenVideoThumbnailUrl) return undefined;
    return character.lastSeenVideoThumbnailUrl
      .replace('%{width}', '440')
      .replace('%{height}', '248')
  }, [character.lastSeenVideoThumbnailUrl]);

  const { url: loadedThumbnailUrl } = useImageUrlOnceLoaded(lastSeenVideoThumbnailUrl);

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
      <div
        className={classes(
          styles.thumbnail,
          lastSeenVideoThumbnailUrl && styles.hasThumbnail
        )}
      >
        <CharacterLink character={character}>
          {loadedThumbnailUrl &&
            <>
              <img
                className={styles.lastStreamThumbnail}
                src={loadedThumbnailUrl}
                alt={`${character.channelName} stream video thumbnail`}
                loading='lazy'
              />
              <div className={styles.thumbnailBlurOverlay} />
              <div className={styles.thumbnailColorOverlay} />
            </>
          }
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
        {!hideStreamer &&
          <ProfilePhoto
            className={styles.pfp}
            channelInfo={character.channelInfo}
            size={30}
          />
        }
        <div className={styles.text}>
          <div className={classes(styles.title, wrapTitle && styles.wrap)}>
            <p title={character.lastSeenTitle ?? realName}>{character.lastSeenTitle ?? realName}</p>
          </div>
          {!hideStreamer &&
            <div className={styles.channel}>
              <p>
                <CharacterLink character={character}>
                  {character.channelName}
                </CharacterLink>
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
});

export default OfflineCharacterCard;
