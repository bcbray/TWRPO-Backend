import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { LiveResponse, CharactersResponse } from './types';
import { factionsFromLive, ignoredFactions } from './utils'
import { useSingleSearchParam, useDebouncedValue } from './hooks';
import { useLoading, isSuccess } from './LoadingState';

import StreamList from './StreamList';
import FilterBar from './FilterBar';

interface Props {
  live: LiveResponse;
  loadTick: number;
}

const Live: React.FC<Props> = ({ live, loadTick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText, 200);
  const filterTextForSearching = debouncedFilterText.toLowerCase().trim();

  const [charactersLoadingState] = useLoading<CharactersResponse>('/api/v2/characters', { needsLoad: filterText.length > 0 });

  const characters = React.useMemo(() => (
    isSuccess(charactersLoadingState)
      ? charactersLoadingState.data.characters
      : []
  ), [charactersLoadingState]);

  const factionInfos = React.useMemo(() => factionsFromLive(live), [live]);
  const factionInfoMap = React.useMemo(() => Object.fromEntries(factionInfos.map(info => [info.key, info])), [factionInfos]);

  const filterFactions = React.useMemo(() => (
    factionInfos
      .filter(f => f.isLive === true)
      .filter(f => f.hideInFilter !== true)
  ), [factionInfos]);

  const filteredStreams = React.useMemo(() => {
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
    }, [debouncedFilterText, factionKey, filterTextForSearching, live.streams])

  const offlineCharacters = React.useMemo(() => {
    const liveChannels = new Set(filteredStreams.map(c => c.channelName));

    return filterTextForSearching.length === 0
      ? []
      : characters
        .filter(character =>
          !liveChannels.has(character.channelName)
          && ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && (
            character.channelName.toLowerCase().includes(filterTextForSearching)
            || character.name.toLowerCase().includes(filterTextForSearching)
            || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterTextForSearching))
            || character.factions.some(f => f.name.toLowerCase().includes(filterTextForSearching))
          )
        )
        // Limit to 50 offline characters to not overwhelm the list
        .slice(0, 50);
  }, [characters, factionKey, filterTextForSearching, filteredStreams]);

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
          allHref={'/'}
          factionHref={(f) => `/streams/faction/${f.key}`}
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
