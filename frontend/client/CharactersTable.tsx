import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { CharacterInfo } from '@twrpo/types';

import styles from './CharactersTable.module.css';
import LiveBadge from './LiveBadge';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import { useFactionCss } from './FactionStyleProvider';

interface Props {
  characters: CharacterInfo[];
  hideStreamer?: boolean;
  noInset?: boolean;
};

const CharactersTable: React.FunctionComponent<Props> = ({
  characters,
  hideStreamer = false,
  noInset = false,
}) => {
  const location = useLocation();
  const { factionStyles } = useFactionCss();

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
          <th style={{ width: '25%' }}>Name</th>
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
          <th style={{ width: '20%' }}>Factions</th>
          </tr>
        </thead>
        <tbody>
          {characters && characters.map((character) => {
            const factionsToShow = character.factions.length === 1 && character.factions[0].key === 'independent'
              ? []
              : character.factions;
            return (
              <tr className={styles.characterRow} key={`${character.channelName}_${character.name}`}>
                {!hideStreamer &&
                  <td className={styles.channelName}>
                    <a style={{ textDecoration: 'none' }} href={`/streamer/${character.channelName.toLowerCase()}`}>
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
                    </a>
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
                    <span
                    >
                      {faction.name}
                    </span>
                  </Link>
                  )
                }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CharactersTable;
