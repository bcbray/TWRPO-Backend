import React from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { LiveResponse } from './types'
import { factionsFromLive, ignoredFactions } from './utils'

import StreamList from './StreamList';
import FilterBar from './FilterBar';

interface Props {
  data: LiveResponse;
}

const Live: React.FC<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [searchParams, setSearchParams] = useSearchParams();

  const factionInfos = factionsFromLive(data);
  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions = factionInfos
    .filter(f => f.isLive === true)
    .filter(f => f.hideInFilter !== true);

  const filteredStreams = (() => {
      const streams = data.streams
        .filter(stream => !ignoredFactions.includes(stream.tagFaction))
        .filter(stream => !(stream.tagFactionSecondary && ignoredFactions.includes(stream.tagFactionSecondary)))
      const filterText = searchParams.get('search')?.toLowerCase() || ''
      const filterTextLookup = filterText
        .replace(/^\W+|\W+$|[^\w\s]+/g, ' ')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
      const filtered = (factionKey === undefined && filterText.length === 0)
        ? streams
        : streams.filter(stream =>
          ((factionKey && stream.factionsMap[factionKey]) || !factionKey)
            && ((filterText && (
              stream.tagText.toLowerCase().includes(filterText)
              || (stream.characterName && stream.characterName.toLowerCase().includes(filterText))
              || (stream.nicknameLookup && stream.nicknameLookup.includes(filterTextLookup))
              || stream.channelName.toLowerCase().includes(filterText)
              || stream.title.toLowerCase().includes(filterText)
            )
          ) || !filterText)
        )
      const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      return sorted;
    })()

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
          searchText={searchParams.get('search') || ''}
          onChangeSearchText={text => text ? setSearchParams({ search: text }) : setSearchParams({}) }
        />
        <StreamList
          streams={filteredStreams}
          factionInfos={factionInfoMap}
        />
      </>
    )
  )
};

export default Live;
