import React from 'react';
import { useCss } from 'react-use';
import { Dropdown } from 'react-bootstrap';

import styles from './FactionDropdown.module.css';
import { FactionInfo } from './types';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo | null;
  onSelect: (faction: FactionInfo | null) => void;
  itemContent?: (faction: FactionInfo) => React.ReactNode;
};

const FactionDropdown: React.FC<Props> = ({
  factions,
  selectedFaction = null,
  onSelect,
  itemContent = f => (f.name)
}) => {
  const className = useCss({
    '.btn-independent': {
      backgroundColor: '#12af7e',
      borderColor: '#12af7e',
    },
    'a.dropdown-item:active': {
      color: '#fff',
      backgroundColor: '#12af7e',
    },
    ...Object.fromEntries(factions.flatMap((faction) => {
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

  return (
    <Dropdown
      className={[className, styles.factionDropdown].join(' ')}
      onSelect={e => onSelect(factions.find(f => f.key === e) || null)}
    >
      <Dropdown.Toggle variant={selectedFaction?.key ?? 'independent'}>
        {selectedFaction?.name ?? 'Select faction'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey=''>All WildRP (no filtering)</Dropdown.Item>
        {factions
          .map(faction =>
            <Dropdown.Item
              key={faction.key}
              className={`faction-${faction.key}`}
              eventKey={faction.key}
            >
              {itemContent(faction)}
            </Dropdown.Item>
          )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FactionDropdown;
