import React from 'react';
import { Link } from 'react-router-dom';

import styles from './FilterBar.module.css'
import { FactionInfo } from './types';
import FactionDropdown from './FactionDropdown';
import FeedbackModal from './FeedbackModal';
import { classes } from './utils';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo;
  onSelectFaction: (faction: FactionInfo | null) => void;
  searchText: string;
  onChangeSearchText: (text: string) => void;
}

const FilterBar: React.FC<Props> = ({ factions, selectedFaction, onSelectFaction, searchText, onChangeSearchText }) => {
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleShowFeedback = <T,>(e: React.MouseEvent<T>) => {
    setShowingFeedbackModal(true);
    e.preventDefault();
  }
  const handleCloseFeedback = () => setShowingFeedbackModal(false);
  return (
    <>
      <div className={classes(styles.container, 'inset')}>
        <FactionDropdown
          className={styles.factionsDropdown}
          factions={factions}
          selectedFaction={selectedFaction}
          onSelect={onSelectFaction}
        />
        <input
          className={styles.search}
          type='text'
          placeholder='Search for character name / nickname / stream…'
          value={searchText}
          onChange={e => onChangeSearchText(e.target.value)}
        />
        <Link
          className={classes('button', 'secondary', styles.feedbackButton)}
          to='/feedback'
          onClick={handleShowFeedback}
        >
          Suggest changes
        </Link>
      </div>
      <FeedbackModal show={showingFeedbackModal} onHide={handleCloseFeedback} />
    </>
  );
};

export default FilterBar;
