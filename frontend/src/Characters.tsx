import React from 'react';
import styles from './Characters.module.css';
import { Form, Stack, Button } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import CharactersTable from './CharactersTable';
import { CharactersResponse } from './types';
import FeedbackModal from './FeedbackModal';
import FactionDropdown from './FactionDropdown';

interface Props {
  data: CharactersResponse
};

const Characters: React.FunctionComponent<Props> = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { factionKey } = params;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleCloseFeedback = () => setShowingFeedbackModal(false);
  const handleShowFeedback = () => setShowingFeedbackModal(true);

  const filteredCharacters = (() => {
    const characters = data.characters;
    const filterText = searchParams.get('search')?.toLowerCase() || ''
    const filtered = (factionKey === undefined && filterText.length === 0)
      ? characters
      : characters.filter(character =>
        ((factionKey && character.factions.some(f => f.key === factionKey)) || !factionKey)
          && ((filterText && (
              character.channelName.toLowerCase().includes(filterText)
              || character.name.toLowerCase().includes(filterText)
              || character.displayInfo.nicknames.some(n => n.toLowerCase().includes(filterText))
              || character.factions.some(f => f.name.toLowerCase().includes(filterText))
            )
          ) || !filterText)
        )
      return filtered;
  })()

  const selectedFaction = factionKey ? data.factions.find(f => f.key === factionKey) : undefined;

  return (
    <>
      {selectedFaction &&
        <Helmet>
          <title>Twitch WildRP Only - {selectedFaction.name} Characters</title>
        </Helmet>
      }
      <FeedbackModal show={showingFeedbackModal} onHide={handleCloseFeedback} />
      <Stack direction='horizontal' gap={3} className="mb-4">
        <FactionDropdown
          factions={data.factions}
          selectedFaction={selectedFaction}
          onSelect={f => navigate(`/characters${f ? `/${f.key}` : ''}${location.search}`) }
        />
        <Form.Control
          className={styles.search}
          type="text"
          placeholder="Search for character name / nickname / stream..."
          value={searchParams.get('search') || ''}
          onChange={ e => e.target.value ? setSearchParams({ search: e.target.value }) : setSearchParams({}) }
        />
        <Button
          className={styles.feedbackButton}
          variant="secondary"
          onClick={handleShowFeedback}
        >
          Suggest changes
        </Button>
      </Stack>
      <CharactersTable characters={filteredCharacters} />
    </>
  )
}

export default Characters;
