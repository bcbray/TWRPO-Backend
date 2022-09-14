import React from 'react';
import isMobile from 'is-mobile';

import styles from './FancyDropdown.module.css';
import { classes } from './utils';
import Dropdown from  './Dropdown';
import DropdownButton from  './DropdownButton';
import DropdownMenu from  './DropdownMenu';

export interface LineItem {
  id: string;
  name: string;
  element: React.ReactElement;
}

export interface FancyDropdownProps<Item extends LineItem> {
  items: Item[];
  title: string;
  onSelect: (item: Item | null) => void;
  className?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  matcher?: (item: Item, filter: string) => boolean;
};

function defaultMatcher<Item extends LineItem>(item: Item, filter: string) {
  return item.name.toLowerCase().includes(filter);
}

export function FancyDropdown<Item extends LineItem>({
  items,
  title,
  onSelect,
  className: outerClassName,
  buttonClassName,
  buttonStyle,
  matcher = defaultMatcher,
}: FancyDropdownProps<Item>) {
  const [filterText, setFilterText] = React.useState('');

  const filterTextToUse = filterText.toLowerCase().trim();

  const visibleItems = React.useMemo(() => (
    filterTextToUse === ''
      ? items
      : items.filter(i => matcher(i, filterTextToUse))
  ), [items, filterTextToUse, matcher]);

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
      onSelect={e => onSelect(items.find(f => f.id === e) || null)}
    >
      <DropdownButton
        className={classes(
          buttonClassName,
        )}
        style={buttonStyle}
      >
        {title}
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

export default FancyDropdown;
