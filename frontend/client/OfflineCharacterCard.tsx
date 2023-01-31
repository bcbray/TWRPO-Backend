import React from 'react';
import { Link } from 'react-router-dom';
import { CharacterInfo, FactionInfo } from '@twrpo/types';

import styles from './OfflineCharacterCard.module.css';
import { classes } from './utils';
import { useRelativeDateMaybe, useLoadStateImageUrl } from './hooks';
import { useFactionCss } from './FactionStyleProvider';
import ProfilePhoto from './ProfilePhoto';
import OutboundLink from './OutboundLink';
import StreamTagOverlay, { usePrimaryTagsForCharacter } from './StreamTagOverlay';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  character: CharacterInfo;
  hideStreamer?: boolean;
  wrapTitle?: boolean;
  onSelectFaction?: (faction: FactionInfo) => void;
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
  {
    character,
    className,
    style,
    hideStreamer = false,
    wrapTitle = false,
    onSelectFaction,
    ...rest
  }, ref
) => {
  const { factionStylesForKey } = useFactionCss();
  const lastSeenLiveDate = React.useMemo(() => {
    if (!character.lastSeenLive) return undefined;
    const date = new Date(character.lastSeenLive);
    if (isNaN(date.getTime())) return undefined;
    return date;
  }, [character.lastSeenLive]);

  const lastSeenLive = useRelativeDateMaybe(lastSeenLiveDate);

  const realName = React.useMemo(() => (
    character.displayInfo.realNames.join(' ')
  ), [character.displayInfo.realNames])

  const lastSeenVideoThumbnailUrl = React.useMemo(() => {
    if (!character.lastSeenVideoThumbnailUrl) return undefined;
    return character.lastSeenVideoThumbnailUrl
      .replace('%{width}', '440')
      .replace('%{height}', '248')
  }, [character.lastSeenVideoThumbnailUrl]);

  const { failed: thumbnailLoadFailed } = useLoadStateImageUrl(lastSeenVideoThumbnailUrl);

  const primaryTags = usePrimaryTagsForCharacter(character, onSelectFaction)

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
          lastSeenVideoThumbnailUrl && !thumbnailLoadFailed && styles.hasThumbnail
        )}
      >
        <CharacterLink character={character}>
          {lastSeenVideoThumbnailUrl && !thumbnailLoadFailed &&
            <>
              <img
                className={styles.lastStreamThumbnail}
                src={lastSeenVideoThumbnailUrl}
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
        <StreamTagOverlay
          className={styles.tagOverlay}
          topLeft={primaryTags}
        />
      </div>
      <div className={classes(styles.info, 'stream-card-info')}>
        {!hideStreamer &&
          <Link to={`/streamer/${character.channelInfo?.login ?? character.channelName.toLowerCase()}`}>
            <ProfilePhoto
              className={styles.pfp}
              channelInfo={character.channelInfo}
              size={30}
            />
          </Link>
        }
        <div className={styles.text}>
          <div className={classes(styles.title, wrapTitle && styles.wrap)}>
            <p title={character.lastSeenTitle ?? realName}>{character.lastSeenTitle ?? realName}</p>
          </div>
          {!hideStreamer &&
            <div className={styles.channel}>
              <p>
                <Link to={`/streamer/${character.channelInfo?.login ?? character.channelName.toLowerCase()}`}>
                  {character.channelName}
                </Link>
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
});

export default OfflineCharacterCard;
