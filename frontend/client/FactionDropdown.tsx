import React from 'react';
import { FactionInfo } from '@twrpo/types';

import styles from './FactionDropdown.module.css';
import { classes } from './utils';
import { useFactionCss } from './FactionStyleProvider';
import { FancyDropdown, LineItem } from './FancyDropdown';
import DropdownItem from  './DropdownItem';
import { useCurrentServer } from './CurrentServer';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo | null;
  onSelect: (faction: FactionInfo | null) => void;
  itemContent?: (faction: FactionInfo) => React.ReactNode;
  className?: string;
  allHref?: string;
  itemHref?: (faction: FactionInfo) => string;
};

interface FactionLineItem extends LineItem {
  faction?: FactionInfo;
}

const FactionDropdown: React.FC<Props> = ({
  factions,
  selectedFaction = null,
  onSelect,
  itemContent = f => (f.name),
  className: outerClassName,
  allHref,
  itemHref,
}) => {
  const { server } = useCurrentServer();
  const { factionStyles, factionStylesForKey } = useFactionCss();

  const allItems: FactionLineItem[] = [
    {
      id: 'meta-all',
      name: `All ${server.name}`,
      element: (
        <DropdownItem
          key='meta-all'
          href={allHref}
          onClick={(e) => e.preventDefault()}
          className={classes(
            styles.item,
            styles.noFilter,
            selectedFaction === null && styles.active
          )}
          eventKey=''
          style={factionStylesForKey()}
        >
          All WildRP (no filtering)
        </DropdownItem>
      )
    },
    ...(factions
      .map(faction => ({
        id: faction.key,
        name: faction.name,
        faction: faction,
        element: (
          <DropdownItem
            key={faction.key}
            href={itemHref?.(faction)}
            onClick={(e) => e.preventDefault()}
            className={classes(
              styles.item,
              selectedFaction?.key === faction.key && styles.active
            )}
            eventKey={faction.key}
            active={selectedFaction?.key === faction.key}
            style={factionStyles(faction)}
          >
            {itemContent(faction)}
          </DropdownItem>
        )
      })))
  ]

  return <FancyDropdown
    items={allItems}
    title={selectedFaction?.name ?? `All ${server.name}`}
    onSelect={item => onSelect(item?.faction || null)}
    className={outerClassName}
    buttonClassName={styles.factionDropdownButton}
    buttonStyle={factionStylesForKey(selectedFaction?.key)}
  />;
};

export default FactionDropdown;
