import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import { CharacterInfo } from './types';

interface Props {
  characters: CharacterInfo[];
};

const CharactersTable: React.FunctionComponent<Props> = ({ characters }) => {
  const location = useLocation();
  return (
    <Table hover className="character-table">
      <thead>
        <tr>
        <th style={{ width: '25%' }}>Streamer</th>
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
        <th style={{ width: '25%' }}>Factions</th>
        </tr>
      </thead>
      <tbody>
        {characters.map(character =>
        <tr key={character.channelName + character.name}>
          <td className="character-channel-name">
          <a className="text-dark" style={{ textDecoration: 'none' }} href={`https://twitch.tv/${character.channelName.toLowerCase()}`}>
            {character.channelName}
          </a>
          </td>
          <td className="character-name">{character.name}</td>
          <td className="character-nicknames">{character.nicknames.join(', ')}</td>
          <td className="character-factions">
          {
            character.factions.map(filter =>
            <Link
              key={filter.key}
              className="me-1"
              to={`/characters/${filter.key}${location.search}`}
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
        )}
      </tbody>
    </Table>
  );
};

export default CharactersTable;
