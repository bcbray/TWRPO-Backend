import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveResponse, FactionsResponse } from '@twrpo/types';
import _ from 'lodash';

import styles from './Live.module.css';

import { ignoredFactions } from './utils'
import { useSingleSearchParam, useDebouncedValue } from './hooks';
import { isSuccess, isLoading } from './LoadingState';
import { useCharacters } from './Data';

import StreamList from './StreamList';
import FilterBar from './FilterBar';

interface Props {
  live: LiveResponse;
  factions: FactionsResponse;
  loadTick: number;
}

const Live: React.FC<Props> = ({ live, factions, loadTick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText, 200);
  const filterTextForSearching = debouncedFilterText.toLowerCase().trim();

  const filterRegex = React.useMemo(() => {
    if (!filterTextForSearching) return undefined;
    const escapedFilter = _.escapeRegExp(filterTextForSearching)
      // Match curly or straight quotes
      // So “O’Grady” and “O'Grady” both match “O’Grady”
      .replaceAll(/['‘’]/g, '[‘’\']')
      .replaceAll(/["“”]/g, '[“”"]');

    return new RegExp(escapedFilter, 'i');
  }, [filterTextForSearching]);

  const showOlderOfflineCharacters = filterTextForSearching.length !== 0
    || (factionKey !== undefined && factionKey !== 'independent');

  const [charactersLoadingState] = useCharacters({
    needsLoad: showOlderOfflineCharacters,
    skipsPreload: true,
  });

  const characters = React.useMemo(() => (
    isSuccess(charactersLoadingState)
      ? charactersLoadingState.data.characters
      : []
  ), [charactersLoadingState]);

  const factionInfos = factions.factions;
  const selectedFaction = React.useMemo(() => (
    factionKey ? factionInfos.find(f => f.key === factionKey) : undefined
  ), [factionKey, factionInfos]);

  const filterFactions = React.useMemo(() => (
    [...factionInfos]
      .filter(f => f.hasCharacters === true)
      .filter(f => f.hideInFilter !== true)
      .sort((lhs, rhs) => {
        if (lhs.isLive === rhs.isLive) return 0;
        if (lhs.isLive) return -1;
        return 1;
      })
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
      const filtered = (factionKey === undefined && filterRegex === undefined)
        ? streams
        : streams.filter(stream =>
          ((factionKey && stream.factionsMap[factionKey]) || !factionKey)
            && ((filterRegex && (
              filterRegex.test(stream.tagText)
              || (stream.characterName && filterRegex.test(stream.characterName))
              || (stream.nicknameLookup && stream.nicknameLookup.includes(filterTextLookup))
              || filterRegex.test(stream.channelName)
              || filterRegex.test(stream.title)
              || stream.factions.some(f => filterRegex.test(f))
            )
          ) || !filterRegex)
        )
      const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      return sorted;
    }, [debouncedFilterText, factionKey, filterRegex, live.streams])

  const offlineCharacters = React.useMemo(() => {
    const liveCharacterIds = new Set((filteredStreams ?? []).map(s => s.characterId));

    const recentOfflineCharacters = live.recentOfflineCharacters ?? [];
    const recentOfflineCharacerIds = new Set(recentOfflineCharacters.map(c => c.id));
    const olderOfflineCharacter = showOlderOfflineCharacters
      ? characters.filter(c => !recentOfflineCharacerIds.has(c.id) && !liveCharacterIds.has(c.id))
      : []
    const candidateCharacters = [...recentOfflineCharacters, ...olderOfflineCharacter];

    return candidateCharacters
        .filter(character =>
          ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
            && ((filterRegex && (
              filterRegex.test(character.channelName)
              || filterRegex.test(character.name)
              || character.displayInfo.nicknames.some(n => filterRegex.test(n))
              || character.factions.some(f => filterRegex.test(f.name))
            )
          ) || !filterRegex)
        )
        .sort((lhs, rhs) => {
          if (lhs.lastSeenLive && rhs.lastSeenLive) {
            return rhs.lastSeenLive.localeCompare(lhs.lastSeenLive);
          }
          if (lhs.lastSeenLive && !rhs.lastSeenLive) {
            return -1;
          }
          if (!lhs.lastSeenLive && rhs.lastSeenLive) {
            return 1;
          }
          return lhs.displayInfo.realNames.join(' ').localeCompare(rhs.displayInfo.realNames.join(' '));
        })
  }, [characters, factionKey, filterRegex, filteredStreams, live.recentOfflineCharacters, showOlderOfflineCharacters]);

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
          factionItemContent={f => f.isLive ? f.name : <span className={styles.notLive}>{f.name} (not live)</span>}
          searchText={filterText}
          onChangeSearchText={text => setFilterText(text, { replace: true })}
          allHref={'/'}
          factionHref={(f) => `/streams/faction/${f.key}`}
        />
        <StreamList
          streams={filteredStreams}
          offlineCharacters={offlineCharacters}
          isLoadingMore={showOlderOfflineCharacters && isLoading(charactersLoadingState)}
          paginationKey={factionKey ?? '_no-faction_'}
          loadTick={loadTick}
        />
      </>
    )
  )
};

export default Live;
