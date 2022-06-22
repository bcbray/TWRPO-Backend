import React from 'react';
import { Form, Stack, Button } from 'react-bootstrap';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

import styles from './FilterBar.module.css'
import { FactionInfo } from './types';
import FactionDropdown from './FactionDropdown';
import FeedbackModal from './FeedbackModal';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo;
  onSelectFaction: (faction: FactionInfo | null) => void;
  searchText: string;
  onChangeSearchText: (text: string) => void;
}

const FilterBar: React.FC<Props> = ({ factions, selectedFaction, onSelectFaction, searchText, onChangeSearchText }) => {
  const { trackEvent } = useMatomo()
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleShowFeedback = () => {
    trackEvent({
      category: 'Feedback',
      action: 'Open Feedback Form',
    })
    setShowingFeedbackModal(true);
  }
  const handleCloseFeedback = (sent: boolean) => {
    trackEvent({
      category: 'Feedback',
      action: sent ? 'Feedback Sent' : 'Feedback Dismissed',
    })
    setShowingFeedbackModal(false);
  }
  return (
    <>
      <Stack direction='horizontal' gap={3} className={['mb-4', styles.container].join(' ')}>
        <FactionDropdown
          className={styles.factionsDropdown}
          factions={factions}
          selectedFaction={selectedFaction}
          onSelect={onSelectFaction}
        />
        <Form.Control
          className={styles.search}
          type="text"
          placeholder="Search for character name / nickname / stream..."
          value={searchText}
          onChange={e => onChangeSearchText(e.target.value)}
        />
        <Button
          className={styles.feedbackButton}
          variant="secondary"
          onClick={handleShowFeedback}
        >
          Suggest changes
        </Button>
      </Stack>
      <FeedbackModal show={showingFeedbackModal} onHide={handleCloseFeedback} />
    </>
  );
};

export default FilterBar;
