import React from 'react';
import { Table, Badge, OverlayTrigger } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";

import styles from './CharactersTable.module.css';
import { CharacterInfo, FactionInfo, Stream } from './types';
import Tag from './Tag';
import StreamCard from './StreamCard';

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
        />
      </div>
    )}
  >
    <Tag as='span' className={styles.liveTag}>Live</Tag>
  </OverlayTrigger>
);

const CharactersTable: React.FunctionComponent<Props> = ({ characters, factionInfos }) => {
  const location = useLocation();
  return (
    <div className="table-responsive">
      <Table hover className='character-table'>
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
          {characters.map((character) => {
            const factionsToShow = character.factions.length === 1 && character.factions[0].key === 'independent'
              ? []
              : character.factions;
            return (
              <tr key={character.channelName + character.name}>
                <td className="character-channel-name">
                <a className="text-dark" style={{ textDecoration: 'none' }} href={`https://twitch.tv/${character.channelName.toLowerCase()}`}>
                  {character.channelName}
                  {character.liveInfo && <LiveBadge stream={character.liveInfo} factionInfos={factionInfos} />}
                </a>
                </td>
                <td className="character-titles">{character.displayInfo.titles.join(', ')}</td>
                <td className="character-name">{character.displayInfo.realNames.join(' ')}</td>
                <td className="character-nicknames">{character.displayInfo.nicknames.join(', ')}</td>
                <td className="character-factions">
                {
                  factionsToShow.map((filter) =>
                  <Link
                    key={filter.key}
                    className="me-1"
                    to={`/characters/faction/${filter.key}${location.search}`}
                  >
                    <Badge
                    pill
                    bg={filter.colorLight ? 'blank' : 'secondary'}
                    style={{ backgroundColor: filter.colorLight }}
                    >
                    {filter.name}
                    </Badge>
                  </Link>
                  )
                }
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CharactersTable;
