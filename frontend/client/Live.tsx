import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveResponse, FactionsResponse, CharacterInfo, FactionInfo } from '@twrpo/types';

import styles from './Live.module.css';

import { ignoredFactions, classes } from './utils'
import { useSingleSearchParam, useDebouncedValue, useFilterRegex } from './hooks';
import { isSuccess, isLoading } from './LoadingState';
import { useCharacters } from './Data';
import { useCurrentServer } from './CurrentServer';

import StreamList from './StreamList';
import FilterBar from './FilterBar';
import NotFound from './NotFound';

interface Props {
  live: LiveResponse;
  factions: FactionsResponse;
  loadTick: number;
  handleRefresh: () => void;
}

const offlineSort = (lhs: CharacterInfo, rhs: CharacterInfo) => {
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
};

const Live: React.FC<Props> = ({ live, factions, loadTick, handleRefresh }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [filterText, setFilterText] = useSingleSearchParam('search');
  const debouncedFilterText = useDebouncedValue(filterText.trim(), 200);
  const filterRegex = useFilterRegex(debouncedFilterText);
  const { server } = useCurrentServer();

  const showOlderOfflineCharacters = filterRegex !== undefined
    || (factionKey !== undefined && factionKey !== 'independent');

  const [charactersLoadingState] = useCharacters({
    serverId: server.id,
  }, {
    needsLoad: showOlderOfflineCharacters,
    skipsPreload: true,
  });

  const characters = React.useMemo(() => (
    isSuccess(charactersLoadingState)
      ? charactersLoadingState.data.characters
      : []
  ), [charactersLoadingState]);

  const factionInfos = React.useMemo(() => (
    factions.factions.map(faction => ({
      ...faction,
      liveCount: live.factionCount[faction.key],
      isLive: live.factionCount[faction.key] > 0,
    }))
  ), [factions.factions, live]);

  const factionsByKey = React.useMemo(() => (
    Object.fromEntries(factionInfos.map(f => [f.key, f]))
  ), [factionInfos]);

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

  const [filteredStreams, otherFilteredStreams] = React.useMemo(() => {
      const streams = live.streams
        .filter(stream => !ignoredFactions.includes(stream.tagFaction))
        .filter(stream => !(stream.tagFactionSecondary && ignoredFactions.includes(stream.tagFactionSecondary)))
      const filterTextLookup = debouncedFilterText
        .replace(/^\W+|\W+$|[^\w\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
      const textFiltered = (filterRegex === undefined)
        ? streams
        : streams.filter(stream =>
          filterRegex.test(stream.tagText)
          || (stream.characterName && filterRegex.test(stream.characterName))
          || (stream.characterDisplayName && filterRegex.test(stream.characterDisplayName))
          || (stream.nicknameLookup && stream.nicknameLookup.includes(filterTextLookup))
          || (stream.characterContact && filterRegex.test(stream.characterContact))
          || filterRegex.test(stream.channelName)
          || filterRegex.test(stream.title)
          || stream.factions.some(f => filterRegex.test(f)));
      const filtered = (factionKey === undefined)
          ? textFiltered
          : textFiltered.filter(stream => stream.factionsMap[factionKey]);
      const otherFiltered = (factionKey === undefined || filterRegex === undefined)
          ? []
          : textFiltered.filter(stream => !stream.factionsMap[factionKey]);

      const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      const otherSorted = otherFiltered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      return [sorted, otherSorted];
    }, [debouncedFilterText, factionKey, filterRegex, live.streams])

  const [offlineCharacters, otherOfflineCharacters] = React.useMemo(() => {
    const liveCharacterIds = new Set(live.streams.map(s => s.characterId));

    const recentOfflineCharacters = live.recentOfflineCharacters ?? [];
    const recentOfflineCharacerIds = new Set(recentOfflineCharacters.map(c => c.id));
    const olderOfflineCharacter = showOlderOfflineCharacters
      ? characters.filter(c => !recentOfflineCharacerIds.has(c.id) && !liveCharacterIds.has(c.id))
      : []
    const candidateCharacters = [...recentOfflineCharacters, ...olderOfflineCharacter];

    const textFilteredCandidateCharacters = (filterRegex === undefined)
      ? candidateCharacters
      : candidateCharacters.filter(character =>
        filterRegex.test(character.channelName)
        || filterRegex.test(character.name)
        || character.displayInfo.nicknames.some(n => filterRegex.test(n))
        || character.factions.some(f => filterRegex.test(f.name))
        || (character.contact && filterRegex.test(character.contact)));

    const filtered = (factionKey === undefined)
      ? textFilteredCandidateCharacters
      : textFilteredCandidateCharacters.filter(character => character.factions.some(f => f.key === factionKey));

    const otherFiltered = (factionKey === undefined || filterRegex === undefined)
      ? []
      : textFilteredCandidateCharacters.filter(character => !character.factions.some(f => f.key === factionKey));

    const sorted = filtered.sort(offlineSort);
    const otherSorted = otherFiltered.sort(offlineSort);
    return [sorted, otherSorted];
  }, [characters, factionKey, filterRegex, live.streams, live.recentOfflineCharacters, showOlderOfflineCharacters]);

  const isLoadingMore = showOlderOfflineCharacters && isLoading(charactersLoadingState);
  const matchCount = filteredStreams.length + offlineCharacters.length;
  const otherFactionMatchCount = otherFilteredStreams.length + otherOfflineCharacters.length;

  const onSelectFaction = React.useCallback((faction: FactionInfo | null) => (
    navigate(`/${faction ? `streams/faction/${faction.key}` : ''}${location.search}`)
  ), [navigate, location.search]);

  if (factionKey && !selectedFaction) {
    return <NotFound alreadyContent />;
  }

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
          onSelectFaction={onSelectFaction}
          factionItemContent={f => f.isLive ? f.name : <span className={styles.notLive}>{f.name} (not live)</span>}
          searchText={filterText}
          onChangeSearchText={text => setFilterText(text, { replace: true })}
          allHref={'/'}
          factionHref={(f) => `/streams/faction/${f.key}`}
        />
        {matchCount > 0 || isLoadingMore
          ?
            <StreamList
              streams={filteredStreams}
              offlineCharacters={offlineCharacters}
              isLoadingMore={isLoadingMore}
              paginationKey={factionKey ?? '_no-faction_'}
              loadTick={loadTick}
              handleRefresh={handleRefresh}
              factionsByKey={factionsByKey}
              onSelectFaction={onSelectFaction}
            />
          :
            <div className={classes('inset', styles.noMatches)}>
              <p>{`No characters${debouncedFilterText ? ` matching “${debouncedFilterText}”` : ''}${selectedFaction ? ` from ${selectedFaction.name}` : ''}.`}</p>
            </div>
        }
        {!isLoadingMore && otherFactionMatchCount > 0 && matchCount < 10 &&
          <>
            <h2 className={classes('inset', styles.otherMatchesHeader)}>Matches from other factions</h2>
            <StreamList
              streams={otherFilteredStreams}
              offlineCharacters={otherOfflineCharacters}
              paginationKey={`${factionKey}__other` ?? '_no-faction__other_'}
              loadTick={loadTick}
              handleRefresh={handleRefresh}
              factionsByKey={factionsByKey}
              onSelectFaction={onSelectFaction}
            />
          </>
        }
      </>
    )
  )
};

export default Live;
