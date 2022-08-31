import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LiveResponse, FactionsResponse } from '@twrpo/types';

import styles from './Live.module.css';

import { ignoredFactions } from './utils'
import { useSingleSearchParam, useDebouncedValue } from './hooks';
import { isSuccess } from './LoadingState';
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

  const [charactersLoadingState] = useCharacters({ skipsPreload: true });

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
    const liveCharacterIds = new Set((filteredStreams ?? []).map(s => s.characterId));

    const recentOfflineCharacters = live.recentOfflineCharacters ?? [];
    const recentOfflineCharacerIds = new Set(recentOfflineCharacters.map(c => c.id));
    const olderOfflineCharacter = filterTextForSearching.length !== 0 || factionKey !== undefined
      ? characters.filter(c => !recentOfflineCharacerIds.has(c.id) && !liveCharacterIds.has(c.id))
      : []
    const candidateCharacters = [...recentOfflineCharacters, ...olderOfflineCharacter];

    return candidateCharacters
        .filter(character =>
          ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && (
            character.channelName.toLowerCase().includes(filterTextForSearching)
            || character.name.toLowerCase().includes(filterTextForSearching)
            || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterTextForSearching))
            || character.factions.some(f => f.name.toLowerCase().includes(filterTextForSearching))
          )
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
        // Limit to 50 offline characters to not overwhelm the list
        .slice(0, 50);
  }, [characters, factionKey, filterTextForSearching, filteredStreams, live.recentOfflineCharacters]);

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
          loadTick={loadTick}
        />
      </>
    )
  )
};

export default Live;
