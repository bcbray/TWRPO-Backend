import React from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import { CharactersResponse, CharacterInfo } from './types';
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

  const filteredCharacters = React.useMemo(() => {
    const filterTextForSearching = filterText.toLowerCase().trim();
    const filtered = filterTextForSearching.length === 0
      ? characters
      : characters.filter(character =>
          character.channelName.toLowerCase().includes(filterTextForSearching)
            || character.name.toLowerCase().includes(filterTextForSearching)
            || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterTextForSearching))
            || character.factions.some(f => f.name.toLowerCase().includes(filterTextForSearching))
        )
      return filtered;
  }, [characters, filterText]);

  const factionInfoMap = React.useMemo(() => {
    return Object.fromEntries(data.factions.map(info => [info.key, info]));
  }, [data.factions]);

  const selectedFaction = React.useMemo(() => {
    return factionKey ? factionInfoMap[factionKey] : undefined;
  }, [factionKey, factionInfoMap]);

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
      <CharactersTable characters={filteredCharacters} factionInfos={factionInfoMap} />
    </>
  )
}

export default Characters;
