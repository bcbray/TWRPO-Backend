import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { LiveResponse, CharactersResponse } from './types';
import { factionsFromLive, ignoredFactions } from './utils'
import { useSingleSearchParam, useDebouncedValue } from './hooks';

import StreamList from './StreamList';
import FilterBar from './FilterBar';

interface Props {
  live: LiveResponse;
  characters: CharactersResponse;
  loadTick: number;
}

const Live: React.FC<Props> = ({ live, characters, loadTick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText, 200);

  const filterTextForSearching = debouncedFilterText.toLowerCase().trim();

  const factionInfos = factionsFromLive(live);
  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions = factionInfos
    .filter(f => f.isLive === true)
    .filter(f => f.hideInFilter !== true);

  const filteredStreams = (() => {
      const streams = live.streams
        .filter(stream => !ignoredFactions.includes(stream.tagFaction))
        .filter(stream => !(stream.tagFactionSecondary && ignoredFactions.includes(stream.tagFactionSecondary)))
      const filterTextLookup = debouncedFilterText
        .replace(/^\W+|\W+$|[^\w\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
      const filtered = (factionKey === undefined && filterTextForSearching.length === 0)
        ? streams
        : streams.filter(stream =>
          ((factionKey && stream.factionsMap[factionKey]) || !factionKey)
            && ((filterTextForSearching && (
              stream.tagText.toLowerCase().includes(filterTextForSearching)
              || (stream.characterName && stream.characterName.toLowerCase().includes(filterTextForSearching))
              || (stream.nicknameLookup && stream.nicknameLookup.includes(filterTextLookup))
              || stream.channelName.toLowerCase().includes(filterTextForSearching)
              || stream.title.toLowerCase().includes(filterTextForSearching)
              || stream.factions.some(f => f.toLowerCase().includes(filterTextForSearching))
            )
          ) || !filterTextForSearching)
        )
      const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      return sorted;
    })()

  const liveChannels = new Set(filteredStreams.map(c => c.channelName));

  const offlineCharacters = filterTextForSearching.length === 0
    ? []
    : characters
      .characters
      .filter(character =>
        !liveChannels.has(character.channelName)
        && ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
        && (
          character.channelName.toLowerCase().includes(filterTextForSearching)
          || character.name.toLowerCase().includes(filterTextForSearching)
          || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterTextForSearching))
          || character.factions.some(f => f.name.toLowerCase().includes(filterTextForSearching))
        )
      );

  const selectedFaction = factionKey ? factionInfoMap[factionKey] : undefined;

  return (
    (
      <>
        {selectedFaction &&
          <Helmet>
            <title>Twitch WildRP Only - {selectedFaction.name} Streams</title>
            <meta
              name='description'
              content={`All live ${selectedFaction.name} WildRP streams.`}
            />
          </Helmet>
        }
        <FilterBar
          factions={filterFactions}
          selectedFaction={selectedFaction}
          onSelectFaction={f => navigate(`/${f ? `streams/faction/${f.key}` : ''}${location.search}`) }
          searchText={filterText}
          onChangeSearchText={text => setFilterText(text, { replace: true })}
        />
        <StreamList
          streams={filteredStreams}
          offlineCharacters={offlineCharacters}
          factionInfos={factionInfoMap}
          loadTick={loadTick}
        />
      </>
    )
  )
};

export default Live;
