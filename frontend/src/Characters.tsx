import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import { CharactersResponse } from './types';
import { useSingleSearchParam } from './hooks';

import CharactersTable from './CharactersTable';
import FilterBar from './FilterBar';

interface Props {
  data: CharactersResponse
};

const Characters: React.FunctionComponent<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');

  const filteredCharacters = (() => {
    const characters = data.characters;
    const filtered = (factionKey === undefined && filterText.length === 0)
      ? characters
      : characters.filter(character =>
        ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && ((filterText && (
              character.channelName.toLowerCase().includes(filterText)
              || character.name.toLowerCase().includes(filterText)
              || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterText))
              || character.factions.some(f => f.name.toLowerCase().includes(filterText))
            )
          ) || !filterText)
        )
      return filtered;
  })()

  const selectedFaction = factionKey ? data.factions.find(f => f.key === factionKey) : undefined;

  return (
    <>
      {selectedFaction &&
        <Helmet>
          <title>Twitch WildRP Only - {selectedFaction.name} Characters</title>
          <meta
            name='description'
            content={`Known WildRP ${selectedFaction.name} streamers and their characters`}
          />
        </Helmet>
      }
      <FilterBar
        factions={data.factions}
        selectedFaction={selectedFaction}
        onSelectFaction={f => navigate(`/characters${f ? `/${f.key}` : ''}${location.search}`) }
        searchText={filterText}
        onChangeSearchText={text => setFilterText(text, { replace: false })}
      />
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
