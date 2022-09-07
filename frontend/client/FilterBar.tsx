import React from 'react';
import { Link } from 'react-router-dom';
import { useDatadogRum } from 'react-datadog';
import { FactionInfo } from '@twrpo/types';

import styles from './FilterBar.module.css'
import FactionDropdown from './FactionDropdown';
import FeedbackModal from './FeedbackModal';
import { classes } from './utils';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo;
  onSelectFaction: (faction: FactionInfo | null) => void;
  factionItemContent?: (faction: FactionInfo) => React.ReactNode;
  searchText: string;
  onChangeSearchText: (text: string) => void;
  allHref?: string;
  factionHref?: (faction: FactionInfo) => string;
}

const FilterBar: React.FC<Props> = ({
  factions,
  selectedFaction,
  onSelectFaction,
  factionItemContent,
  searchText,
  onChangeSearchText,
  allHref,
  factionHref,
}) => {
  const [showingFeedbackModal, setShowingFeedbackModal] = React.useState<boolean>(false);
  const handleShowFeedback = React.useCallback(<T,>(e: React.MouseEvent<T>) => {
    setShowingFeedbackModal(true);
    e.preventDefault();
  }, []);
  const handleCloseFeedback = React.useCallback(() => (
    setShowingFeedbackModal(false)
  ), []);
  const rum = useDatadogRum();

  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  const logSearch = React.useCallback((searchText: string) => {
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (searchText) {
        rum.addAction(`Search for "${searchText}"`, {
          type: 'filter-bar-search',
          searchText
        });
      } else {
        rum.addAction(`Clear search`, {
          type: 'filter-bar-search',
          searchText: ''
        });
      }
    }, 1000);
  }, [rum, timeout]);

  return (
    <>
      <div className={classes(styles.container, 'inset')}>
        <FactionDropdown
          className={styles.factionsDropdown}
          factions={factions}
          selectedFaction={selectedFaction}
          itemContent={factionItemContent}
          onSelect={onSelectFaction}
          allHref={allHref}
          itemHref={factionHref}
        />
        <input
          className={styles.search}
          type='search'
          placeholder='Search for character name / nickname / stream…'
          value={searchText}
          onChange={(e) => {
            onChangeSearchText(e.target.value)
            if (!e.isPropagationStopped()) {
              logSearch(e.target.value);
            }
          }}
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
