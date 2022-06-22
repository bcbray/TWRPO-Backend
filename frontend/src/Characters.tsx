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
  const filterTextForSearching = filterText.toLowerCase();

  const filteredCharacters = (() => {
    const characters = data.characters;
    const filtered = (factionKey === undefined && filterTextForSearching.length === 0)
      ? characters
      : characters.filter(character =>
        ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && ((filterTextForSearching && (
              character.channelName.toLowerCase().includes(filterTextForSearching)
              || character.name.toLowerCase().includes(filterTextForSearching)
              || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterTextForSearching))
              || character.factions.some(f => f.name.toLowerCase().includes(filterTextForSearching))
            )
          ) || !filterTextForSearching)
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
        onSelectFaction={f => navigate(`/characters${f ? `/faction/${f.key}` : ''}${location.search}`) }
        searchText={filterText}
        onChangeSearchText={text => setFilterText(text, { replace: true })}
      />
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
