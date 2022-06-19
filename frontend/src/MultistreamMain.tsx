import React from 'react';
import styles from './MultistreamMain.module.css';
import { Dropdown, Stack, Button } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUpdateEffect, useCss } from 'react-use';
import Multistream from './Multistream';
import { CharactersResponse, CharacterInfo } from './types';
import ReloadButton from './ReloadButton';

interface Props {
  data: CharactersResponse,
  onReload: () => void,
};

const MultistreamMain: React.FunctionComponent<Props> = ({ data, onReload }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;

  const [removedCharacters, setRemovedCharacters] = React.useState<CharacterInfo[]>([]);
  useUpdateEffect(() => {
    setRemovedCharacters([])
  }, [factionKey])

  const removeCharacter = (character: CharacterInfo) => {
    setRemovedCharacters([...removedCharacters, character]);
  };
  const reAddCharacter = (character: CharacterInfo) => {
    setRemovedCharacters(removedCharacters.filter(c => c.channelName !== character.channelName));
  }

  const className = useCss({
    '.btn-independent': {
      backgroundColor: '#12af7e',
      borderColor: '#12af7e',
    },
    'a.dropdown-item:active': {
      color: '#fff',
      backgroundColor: '#12af7e',
    },
    ...Object.fromEntries(data.factions.flatMap((faction) => {
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

  const filteredCharacters = (() => {
    const characters = data.characters;
    const liveCharacters = characters
      .filter(character => character.liveInfo !== undefined)
      .filter(character => !removedCharacters.some(c => c.channelName === character.channelName))
    const filtered = (factionKey === undefined)
      ? liveCharacters
      : liveCharacters.filter(character => character.factions.some(f => f.key === factionKey))
    const sorted = filtered.sort((lhs, rhs) =>
      (rhs.liveInfo?.viewers ?? 0) - (lhs.liveInfo?.viewers ?? 0)
    )
    return sorted;
  })()

  const maxStreams = 12;

  const charactersToShow = filteredCharacters.slice(0, maxStreams);

  const selectedFaction = factionKey ? data.factions.find(f => f.key === factionKey) : undefined;

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
          onSelect={e => navigate(`/multistream${e && `/${e}`}${location.search}`) }
        >
          <Dropdown.Toggle variant={selectedFaction?.key ?? 'independent'}>
            {selectedFaction?.name ?? 'Select faction'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey=''>All characters (no filtering)</Dropdown.Item>
            {data.factions
              .filter(faction => faction.liveCount > 0)
              .sort((f1, f2) => {
                if (f1.liveCount === f2.liveCount) {
                  return f1.name.localeCompare(f2.name);
                }
                return f2.liveCount - f1.liveCount
              })
              .map(faction =>
                <Dropdown.Item
                  key={faction.key}
                  className={`faction-${faction.key}`}
                  eventKey={faction.key}
                >
                  {faction.name} ({faction.liveCount === 1 ? `1 stream` : `${faction.liveCount} streams`})
                </Dropdown.Item>
              )}
          </Dropdown.Menu>
        </Dropdown>
        <ReloadButton onClick={onReload} />
        {charactersToShow.length !== filteredCharacters.length && (
          <span title={`Only ${maxStreams} can be shown at once`}>
            {charactersToShow.length === filteredCharacters.length - 1
              ? '1 stream hidden'
              : `${filteredCharacters.length - charactersToShow.length} streams hidden`}
          </span>
        )}
        {removedCharacters.map(character =>
          <Button
            key={character.channelName}
            className={styles.showCharacter}
            variant="secondary"
            size="sm"
            onClick={() => reAddCharacter(character)}
          >
            {character.name}
          </Button>
        )}
      </Stack>
      <Multistream characters={charactersToShow} onClickRemove={removeCharacter} />
    </>
  )
}

export default MultistreamMain;
