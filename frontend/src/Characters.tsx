import React from 'react';
import { Form, Dropdown, Stack } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CharactersTable from './CharactersTable';
import { CharactersResponse } from './types';

interface Props {
  data: CharactersResponse
};

const Characters: React.FunctionComponent<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredCharacters = (() => {
    const characters = data.characters;
    const filterText = searchParams.get('search') || ''
    const filtered = (factionKey === undefined && filterText.length === 0)
      ? characters
      : characters.filter(character =>
        ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && ((filterText && (
              character.channelName.toLowerCase().includes(filterText)
              || character.name.toLowerCase().includes(filterText)
              || character.nicknames.some(n => n.toLowerCase().includes(filterText))
              || character.factions.some(f => f.name.toLowerCase().includes(filterText))
            )
          ) || !filterText)
        )
      return filtered;
  })()

  const selectedFaction = factionKey && data.factions.find(f => f.key === factionKey);

  return (
    <>
      {selectedFaction &&
        <Helmet>
          <title>Twitch WildRP Only - {selectedFaction.name} Characters</title>
        </Helmet>
      }
      <Stack direction='horizontal' gap={3} className="mb-4">
        <Dropdown
          onSelect={e => navigate(`/characters${e && `/${e}`}${location.search}`) }
        >
          <Dropdown.Toggle>
            {(factionKey && data.factions.find(f => f.key === factionKey)?.name) ?? 'Select faction'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey=''>All characters (No filtering)</Dropdown.Item>
            {data.factions.map(faction =>
              <Dropdown.Item key={faction.key} eventKey={faction.key}>{faction.name}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
          <Form.Control
            type="text"
            placeholder="Search for character name / nickname / stream..."
            value={searchParams.get('search') || ''}
            onChange={ e => e.target.value ? setSearchParams({ search: e.target.value }) : setSearchParams({}) }
          />
      </Stack>
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
