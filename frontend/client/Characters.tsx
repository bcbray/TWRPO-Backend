import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { CharactersResponse, CharacterInfo } from '@twrpo/types';

import { useSingleSearchParam, useDebouncedValue, useFilterRegex } from './hooks';

import CharactersTable from './CharactersTable';
import FilterBar from './FilterBar';
import NotFound from './NotFound';

interface Props {
  data: CharactersResponse
};

const Characters: React.FunctionComponent<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText, 200);

  const charactersByFaction = React.useMemo(() => {
    return data.characters.reduce((map, character) => {
      character.factions.forEach(faction => {
        map[faction.key] = map[faction.key] ?? [];
        map[faction.key].push(character);
      });
      return map;
    }, {} as {[key: string]: CharacterInfo[]})
  }, [data.characters])

  const characters = React.useMemo(() => {
    return factionKey === undefined
      ? data.characters
      : charactersByFaction[factionKey] ?? [];
    }, [factionKey, data.characters, charactersByFaction]);

  const filterRegex = useFilterRegex(debouncedFilterText.trim());

  const filteredCharacters = React.useMemo(() => {
    const filtered = filterRegex === undefined
      ? characters
      : characters.filter(character =>
          filterRegex.test(character.channelName)
            || filterRegex.test(character.name)
            || character.displayInfo.nicknames.some(n => filterRegex.test(n))
            || character.factions.some(f => filterRegex.test(f.name))
        )
      return filtered;
  }, [characters, filterRegex]);

  const selectedFaction = React.useMemo(() => {
    return factionKey ? data.factions.find(info => info.key === factionKey) : undefined;
  }, [data.factions, factionKey]);

  if (factionKey && !selectedFaction) {
    return <NotFound alreadyContent />;
  }

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
        allHref={'/characters'}
        factionHref={(f) => `/characters/faction/${f.key}`}
      />
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
