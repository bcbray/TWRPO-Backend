import React from 'react';
import isMobile from 'is-mobile';

import styles from './FactionDropdown.module.css';
import { FactionInfo } from './types';
import { classes } from './utils';
import { useFactionCss } from './FactionStyleProvider';
import Dropdown from  './Dropdown';
import DropdownButton from  './DropdownButton';
import DropdownMenu from  './DropdownMenu';
import DropdownItem from  './DropdownItem';

interface Props {
  factions: FactionInfo[];
  selectedFaction?: FactionInfo | null;
  onSelect: (faction: FactionInfo | null) => void;
  itemContent?: (faction: FactionInfo) => React.ReactNode;
  className?: string;
  allHref?: string;
  itemHref?: (faction: FactionInfo) => string;
};

interface LineItem {
  name: string;
  element: React.ReactElement;
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
  const [filterText, setFilterText] = React.useState('');

  const filterTextToUse = filterText.toLowerCase().trim();

  const { factionStyles, factionStylesForKey } = useFactionCss();

  const allItems: LineItem[] = [
    {
      name: 'All WildRP',
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
        name: faction.name,
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

  const visibleItems = filterTextToUse === ''
    ? allItems
    : allItems.filter(i => i.name.toLowerCase().includes(filterTextToUse));

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const dropdownRef = React.useRef<HTMLElement | null>(null);

  const first = visibleItems[0];
  if (first) {
    visibleItems[0].element = React.cloneElement(first.element, {
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.code === 'ArrowUp') {
          e.preventDefault();
          e.stopPropagation();
          inputRef.current?.focus();
        }
      }
    })
  }

  return (
    <Dropdown
      className={classes(outerClassName)}
      onSelect={e => onSelect(factions.find(f => f.key === e) || null)}
    >
      <DropdownButton
        className={classes(
          styles.factionDropdownButton,
        )}
        style={factionStylesForKey(selectedFaction?.key)}
      >
        {selectedFaction?.name ?? 'All WildRP'}
      </DropdownButton>
      <DropdownMenu
        ref={dropdownRef}
        className={styles.menu}
        onShow={() => {
          if (!isMobile()) {
            inputRef.current?.focus();
          }
        }}
        onHide={() => {
          setFilterText('');
        }}
        alwaysRender
      >
        <input
          ref={inputRef}
          className={styles.search}
          type='search'
          placeholder='Search…'
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          onKeyDown={e => {
            const forward = () => {
              const newEvent = new KeyboardEvent(e.type, {
                charCode: e.charCode,
                code: e.code,
                key: e.key,
                keyCode: e.keyCode,
                location: e.location,
                repeat: e.repeat,
                bubbles: true,
              });
              e.stopPropagation();
              e.preventDefault();
              dropdownRef.current?.dispatchEvent(newEvent);
            }
            // Forward arrow down to the dropdown so it can handle them
            // (it otherwise ignores keypresses on input elements)
            if (e.code === 'ArrowDown') {
              forward();
            } else if (e.code === 'Escape' && filterText.length === 0) {
              forward();
            }
          }}
        />
        {visibleItems.map(item => item.element)}
        {visibleItems.length === 0 &&
          <p className={styles.noMatches}>No matches</p>
        }
      </DropdownMenu>
    </Dropdown>
  );
};

export default FactionDropdown;
