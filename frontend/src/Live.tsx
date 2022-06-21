import React from 'react';
import { Stack, Form } from 'react-bootstrap';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import styles from './Live.module.css';
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
  const [searchParams, setSearchParams] = useSearchParams();

  const factionInfos = factionsFromLive(data);
  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions = factionInfos
    .filter(f => !ignoredFilterFactions.includes(f.key))
    .filter(f => f.isLive === true)

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
          <Form.Control
            className={styles.search}
            type="text"
            placeholder="Search for character name / nickname / stream..."
            value={searchParams.get('search') || ''}
            onChange={ e => e.target.value ? setSearchParams({ search: e.target.value }) : setSearchParams({}) }
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
