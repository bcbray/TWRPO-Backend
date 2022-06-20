import React from 'react';
import styles from './MultistreamMain.module.css';
import { Stack, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUpdateEffect } from 'react-use';
import Multistream from './Multistream';
import { LiveResponse, Stream, FactionInfo } from './types';
import ReloadButton from './ReloadButton';
import FactionDropdown from './FactionDropdown';
import { factionsFromLive, ignoredFactions, ignoredFilterFactions } from './utils'

interface Props {
  data: LiveResponse,
  onReload: () => void,
};

const MultistreamMain: React.FunctionComponent<Props> = ({ data, onReload }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;

  const [removedStreams, setRemovedStreams] = React.useState<Stream[]>([]);
  useUpdateEffect(() => {
    setRemovedStreams([])
  }, [factionKey])

  const removeStream = (stream: Stream) => {
    setRemovedStreams([...removedStreams, stream]);
  };

  const reAddStream = (stream: Stream) => {
    setRemovedStreams(removedStreams.filter(s => s.channelName !== stream.channelName));
  }

  const factionInfos = factionsFromLive(data,)
  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions: FactionInfo[] = data.filterFactions
    .filter(([_, __, isLive]) => isLive)
    .filter(([key]) => !ignoredFilterFactions.includes(key))
    .flatMap(([key, _, isLive]) => {
      const info = factionInfoMap[key];
      if (info === undefined) return [];
      return [
        {...info, isLive}
      ]
    })
    .sort((f1, f2) => {
      if (f1.liveCount === f2.liveCount) {
        return f1.name.localeCompare(f2.name);
      }
      return (f2.liveCount ?? 0) - (f1.liveCount ?? 0)
    })

  const filteredStreams = (() => {
    const streams = data.streams
      .filter(stream => !removedStreams.some(s => s.channelName === stream.channelName))
      .filter(stream => !ignoredFactions.includes(stream.tagFaction))
      .filter(stream => !(stream.tagFactionSecondary && ignoredFactions.includes(stream.tagFactionSecondary)))
    const filtered = (factionKey === undefined)
      ? streams
      : streams.filter(stream => stream.factionsMap[factionKey] )
    const sorted = filtered.sort((lhs, rhs) => rhs.viewers - lhs.viewers)
    return sorted;
  })()

  const maxStreams = 12;

  const streamsToShow = filteredStreams.slice(0, maxStreams);

  const selectedFaction = factionKey ? factionInfoMap[factionKey] : undefined;

  return (
    <>
      {selectedFaction &&
        <Helmet>
          <title>Twitch WildRP Only - {selectedFaction.name} Multistream</title>
        </Helmet>
      }
      <Stack direction='horizontal' gap={3} className="mb-4">
        <FactionDropdown
          factions={filterFactions}
          selectedFaction={selectedFaction}
          onSelect={f => navigate(`/multistream${f ? `/faction/${f.key}` : ''}${location.search}`) }
          itemContent={faction => (
            <>
              {faction.name} {faction.liveCount &&
                <em className="small">
                  ({faction.liveCount === 1 ? `1 stream` : `${faction.liveCount} streams`})
                </em>
              }
            </>
          )}
        />
        <ReloadButton onClick={onReload} />
        {streamsToShow.length !== filteredStreams.length && (
          <span title={`Only ${maxStreams} can be shown at once`}>
            {streamsToShow.length === filteredStreams.length - 1
              ? '1 stream hidden'
              : `${filteredStreams.length - streamsToShow.length} streams hidden`}
          </span>
        )}
        {removedStreams.map(stream =>
          <Button
            key={stream.channelName}
            className={styles.showStream}
            variant="secondary"
            size="sm"
            onClick={() => reAddStream(stream)}
          >
            {stream.tagText}
          </Button>
        )}
      </Stack>
      <Multistream
        streams={streamsToShow}
        factionInfoMap={factionInfoMap}
        onClickRemove={removeStream}
      />
    </>
  )
}

export default MultistreamMain;
