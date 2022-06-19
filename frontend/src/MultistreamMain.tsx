import React from 'react';
import styles from './MultistreamMain.module.css';
import { Dropdown, Stack, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUpdateEffect, useCss } from 'react-use';
import Multistream from './Multistream';
import { Live, Stream, FactionInfo } from './types';
import ReloadButton from './ReloadButton';

interface Props {
  data: Live,
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

  const ignoredFactionKeys = ['other', 'alltwitch', 'allwildrp', 'guessed'];

  const factionInfos: FactionInfo[] = data.filterFactions
    .filter(([key]) => !ignoredFactionKeys.includes(key))
    .map(([key, name, isLive]) => {
      return {
        key,
        name,
        colorLight: data.useColorsLight[key] ?? '#12af7e',
        colorDark: data.useColorsDark[key] ?? '#32ff7e',
        liveCount: data.factionCount[key],
        isLive,
      }
    })

  const factionInfoMap = Object.fromEntries(factionInfos.map(info => [info.key, info]));

  const filterFactions: FactionInfo[] = data.filterFactions
    .filter(([_, __, isLive]) => isLive)
    .flatMap(([key, _, isLive]) => {
      const info = factionInfoMap[key];
      if (info === undefined) return [];
      return [
        {...info, isLive}
      ]
    })

  const className = useCss({
    '.btn-independent': {
      backgroundColor: '#12af7e',
      borderColor: '#12af7e',
    },
    'a.dropdown-item:active': {
      color: '#fff',
      backgroundColor: '#12af7e',
    },
    ...Object.fromEntries(factionInfos.flatMap((faction) => {
      return [
        [
          `.btn-${faction.key}`,
          {
            backgroundColor: faction.colorLight,
            borderColor: faction.colorLight,
          }
        ],
        [
          `a.dropdown-item.faction-${faction.key}`,
          {
            color: faction.colorLight,
          },
        ],
        [
          `a.dropdown-item.faction-${faction.key}:active`,
          {
            color: '#fff',
            backgroundColor: faction.colorLight,
          },
        ],
      ]
    })),
  });

  const filteredStreams = (() => {
    const streams = data.streams
      .filter(stream => !removedStreams.some(s => s.channelName === stream.channelName))
      .filter(stream => !ignoredFactionKeys.includes(stream.tagFaction))
    const filtered = (factionKey === undefined)
      ? streams
      : streams.filter(stream => stream.factions.some(f => f === factionKey))
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
        <Dropdown
          className={[className, styles.factionDropdown].join(' ')}
          onSelect={e => navigate(`/multistream${e ? `/faction/${e}` : ''}${location.search}`) }
        >
          <Dropdown.Toggle variant={selectedFaction?.key ?? 'independent'}>
            {selectedFaction?.name ?? 'Select faction'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey=''>All WildRP (no filtering)</Dropdown.Item>
            {filterFactions
              .sort((f1, f2) => {
                if (f1.liveCount === f2.liveCount) {
                  return f1.name.localeCompare(f2.name);
                }
                return (f2.liveCount ?? 0) - (f1.liveCount ?? 0)
              })
              .map(faction =>
                <Dropdown.Item
                  key={faction.key}
                  className={`faction-${faction.key}`}
                  eventKey={faction.key}
                >
                  {faction.name} {faction.liveCount && <>({faction.liveCount === 1 ? `1 stream` : `${faction.liveCount} streams`})</>}
                </Dropdown.Item>
              )}
          </Dropdown.Menu>
        </Dropdown>
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
