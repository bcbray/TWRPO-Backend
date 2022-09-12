import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { CharacterInfo } from '@twrpo/types';

import styles from './CharactersTable.module.css';
import LiveBadge from './LiveBadge';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import { useFactionCss } from './FactionStyleProvider';
import { useRelativeDateMaybe } from './hooks';

interface Props {
  characters: CharacterInfo[];
  hideStreamer?: boolean;
  noInset?: boolean;
};

interface RowProps {
  character: CharacterInfo;
  hideStreamer: boolean;
}

const CharacterRow: React.FC<RowProps> = ({
  character,
  hideStreamer,
}) => {
  const location = useLocation();
  const { factionStyles } = useFactionCss();
  const factionsToShow = character.factions.length === 1 && character.factions[0].key === 'independent'
    ? []
    : character.factions;
  const lastSeenLiveDate = React.useMemo(() => {
      if (!character.lastSeenLive) return undefined;
      const date = new Date(character.lastSeenLive);
      if (isNaN(date.getTime())) return undefined;
      return date;
    }, [character.lastSeenLive]);

  const lastSeenLive = useRelativeDateMaybe(lastSeenLiveDate);

  return (
    <tr className={styles.characterRow}>
      {!hideStreamer &&
        <td className={styles.channelName}>
          <Link
            className={styles.factionPill}
            to={`/streamer/${character.channelName.toLowerCase()}`}
          >
            <ProfilePhoto
              className={styles.pfp}
              channelInfo={character.channelInfo}
              size={24}
              style={{
                height: '1.5rem',
                width: '1.5rem',
                borderRadius: '0.75rem',
              }}
            />
            {character.channelName}
            {character.liveInfo && <LiveBadge className={styles.liveTag} stream={character.liveInfo} />}
          </Link>
        </td>
      }
      <td className={styles.titles}>{character.displayInfo.titles.join(', ')}</td>
      <td className={styles.name}>
        {character.displayInfo.realNames.join(' ')}
        {hideStreamer && character.liveInfo && <LiveBadge className={styles.liveTag} stream={character.liveInfo} />}
      </td>
      <td className={styles.nicknames}>{character.displayInfo.nicknames.join(', ')}</td>
      <td className={styles.factions}>
      {
        factionsToShow.map((faction) =>
        <Link
          key={faction.key}
          className={styles.factionPill}
          to={`/characters/faction/${faction.key}${location.search}`}
          style={factionStyles(faction)}
        >
          <span>
            {faction.name}
          </span>
        </Link>
        )
      }
      </td>
      <td className={styles.lastSeen}>
        {lastSeenLive &&
          <span title={lastSeenLive.full}>{lastSeenLive.relative}</span>
        }
      </td>
    </tr>
  );
}

const CharactersTable: React.FunctionComponent<Props> = ({
  characters,
  hideStreamer = false,
  noInset = false,
}) => {
  return (
    <div
      className={classes(
        styles.tableContainer,
        !noInset && 'inset'
      )}
    >
      <table className={styles.table}>
        <thead>
          <tr>
          {!hideStreamer && <th style={{ width: '20%' }}>Streamer</th>}
          <th style={{ width: '10%' }}>Titles</th>
          <th style={{ width: '20%' }}>Name</th>
          <th style={{ width: '25%' }}>
            <span
              style={{
                textDecoration: 'underline dotted',
              }}
              title="Nicknames are not only names that characters go by, but also names used in stream titles to identify which character is being played."
            >
              Nicknames
            </span>
          </th>
          <th style={{ width: '10%' }}>Factions</th>
          <th style={{ width: '20%' }}>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {characters && characters.map(character =>
            <CharacterRow
              key={`${character.id}`}
              character={character}
              hideStreamer={hideStreamer}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CharactersTable;
