import React from 'react';
import { Stack } from 'react-bootstrap';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { LiveResponse } from './types'
import { factionsFromLive, ignoredFactions, ignoredFilterFactions } from './utils'

import FactionDropdown from './FactionDropdown';
import StreamList from './StreamList';

interface Props {
  data: LiveResponse;
}

const Live: React.FC<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;

  const factionInfos = factionsFromLive(data);
  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions = factionInfos
    .filter(f => !ignoredFilterFactions.includes(f.key))
    .filter(f => f.isLive === true)

  const filteredStreams = (() => {
      const streams = data.streams
        .filter(stream => !ignoredFactions.includes(stream.tagFaction))
        .filter(stream => !(stream.tagFactionSecondary && ignoredFactions.includes(stream.tagFactionSecondary)))
      const filtered = (factionKey === undefined)
        ? streams
        : streams.filter(stream => stream.factionsMap[factionKey] )
      const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
      return sorted;
    })()

  const factionColors = Object.fromEntries(factionInfos.flatMap((info) => {
    const light = data.useColorsLight[info.key];
    const dark = data.useColorsDark[info.key];
    if (dark === undefined || light === undefined) {
      return [];
    }
    return [[info.key, { dark, light }]];
  }));

  const selectedFaction = factionKey ? factionInfoMap[factionKey] : undefined;

  return (
    (
      <>
        {selectedFaction &&
          <Helmet>
            <title>Twitch WildRP Only - {selectedFaction.name} Streams</title>
          </Helmet>
        }
        <Stack direction='horizontal' gap={3} className="mb-4">
          <FactionDropdown
            factions={filterFactions}
            selectedFaction={selectedFaction}
            onSelect={f => navigate(`/streams${f ? `/faction/${f.key}` : ''}${location.search}`) }
          />
        </Stack>
        <StreamList
          streams={filteredStreams}
          factionColors={factionColors}
        />
      </>
    )
  )
};

export default Live;
