import React from 'react';
import { Link, useLocation } from "react-router-dom";

import styles from './CharactersTable.module.css';
import { CharacterInfo, FactionInfo, Stream } from './types';
import Tag from './Tag';
import StreamCard from './StreamCard';
import ProfilePhoto from './ProfilePhoto';
import { classes } from './utils';
import { useFactionCss, factionStyles } from './hooks';
import OverlayTrigger from './OverlayTrigger';

interface Props {
  characters: CharacterInfo[];
  factionInfos: {[key: string]: FactionInfo};
};

const LiveBadge: React.FC<{ stream: Stream, factionInfos: {[key: string]: FactionInfo} }> = ({ stream, factionInfos }) => (
  <OverlayTrigger
    placement='bottom-start'
    delay={{ show: 250, hide: 100 }}
    overlay={({ placement, arrowProps, show: _show, popper, ...props }) => (
      <div className={styles.streamPopover} {...props}>
        <StreamCard
          id='live-preview-tooltop'
          style={{
            width: 300,
          }}
          stream={stream}
          factionInfos={factionInfos}
          cardStyle='card'
        />
      </div>
    )}
  >
    <Tag as='span' className={styles.liveTag}>Live</Tag>
  </OverlayTrigger>
);

const CharactersTable: React.FunctionComponent<Props> = ({ characters, factionInfos }) => {
  const location = useLocation();
  const factionContainer = useFactionCss(Object.values(factionInfos));

  return (
    <div className={classes(styles.tableContainer, factionContainer, 'inset')}>
      <table className={styles.table}>
        <thead>
          <tr>
          <th style={{ width: '20%' }}>Streamer</th>
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
                <td className={styles.channelName}>
                  <a style={{ textDecoration: 'none' }} href={`https://twitch.tv/${character.channelName.toLowerCase()}`}>
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
                    {character.liveInfo && <LiveBadge stream={character.liveInfo} factionInfos={factionInfos} />}
                  </a>
                </td>
                <td className={styles.titles}>{character.displayInfo.titles.join(', ')}</td>
                <td className={styles.name}>{character.displayInfo.realNames.join(' ')}</td>
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
