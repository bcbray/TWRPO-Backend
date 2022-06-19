import React from 'react';
import { Dropdown, Stack } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Multistream from './Multistream';
import { CharactersResponse } from './types';
import ReloadButton from './ReloadButton';

interface Props {
  data: CharactersResponse,
  onReload: () => void,
};

const MultistreamMain: React.FunctionComponent<Props> = ({ data, onReload }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;

  const filteredCharacters = (() => {
    const characters = data.characters;
    const filtered = (factionKey === undefined)
      ? []
      : characters.filter(character => character.liveInfo !== undefined).filter(character => (character.factions.some(f => f.key === factionKey)))
    const sorted = filtered.sort((lhs, rhs) =>
      (rhs.liveInfo?.viewers ?? 0) - (lhs.liveInfo?.viewers ?? 0)
    )
    return sorted;
  })()

  const selectedFaction = factionKey && data.factions.find(f => f.key === factionKey);

  return (
    <>
      {selectedFaction &&
        <Helmet>
          <title>Twitch WildRP Only - {selectedFaction.name} Multistream</title>
        </Helmet>
      }
      <Stack direction='horizontal' gap={3} className="mb-4">
        <Dropdown
          onSelect={e => navigate(`/multistream${e && `/${e}`}${location.search}`) }
        >
          <Dropdown.Toggle>
            {(factionKey && data.factions.find(f => f.key === factionKey)?.name) ?? 'Select faction'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {data.factions.filter(faction => faction.liveCount > 0).map(faction =>
              <Dropdown.Item key={faction.key} eventKey={faction.key}>
                  {faction.name} ({faction.liveCount === 1 ? `1 stream` : `${faction.liveCount} streams`})
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <ReloadButton onClick={onReload} />
      </Stack>
      <Multistream characters={filteredCharacters} />
    </>
  )
}

export default MultistreamMain;
