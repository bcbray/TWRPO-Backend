import React from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import CharactersTable from './CharactersTable';
import { CharactersResponse } from './types';
import FilterBar from './FilterBar';

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
    const filterText = searchParams.get('search')?.toLowerCase() || ''
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
        </Helmet>
      }
      <FilterBar
        factions={data.factions}
        selectedFaction={selectedFaction}
        onSelectFaction={f => navigate(`/characters${f ? `/${f.key}` : ''}${location.search}`) }
        searchText={searchParams.get('search') || ''}
        onChangeSearchText={text => text ? setSearchParams({ search: text }) : setSearchParams({}) }
      />
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
