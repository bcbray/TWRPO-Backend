import React from 'react';
import { useMedia, useLocalStorage } from 'react-use';
import { Icon, SunFill, MoonFill, Stars } from 'react-bootstrap-icons';
import { Button } from '@restart/ui';

import styles from './ThemeToggle.module.css';

import { classes } from './utils';
import Dropdown from './Dropdown';
import DropdownButton from './DropdownButton';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';


type Theme = 'light' | 'dark';
type ThemeSetting = Theme | 'auto';

interface ThemeToggleProps {
  className?: string;
}

const LightIcon: React.FC<React.ComponentProps<Icon>> = (props) => <SunFill {...props} />
const DarkIcon: React.FC<React.ComponentProps<Icon>> = (props) => <MoonFill {...props} />
const AutoIcon: React.FC<React.ComponentProps<Icon>> = (props) => <Stars {...props} />

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className
}) => {
  const isSystemDark = useMedia('(prefers-color-scheme: dark)', false);
  const [storedThemeSetting, setThemeSetting] = useLocalStorage('theme', 'auto' as ThemeSetting);
  const themeSetting = storedThemeSetting ?? 'auto';

  const theme: Theme = themeSetting === 'dark'
    ? 'dark'
    : themeSetting === 'light'
      ? 'light'
      : isSystemDark ? 'dark' : 'light'

  React.useEffect(() => {
    if (themeSetting === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else if (themeSetting === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.remove('dark');
    }
  }, [themeSetting]);

  const ThemeIcon = theme === 'dark' ? DarkIcon : LightIcon;

  return (
    <div
        className={className}
    >
      <Dropdown
        className={styles.dropdown}
        onSelect={e => setThemeSetting(e as ThemeSetting)}
      >
        <DropdownButton className={styles.toggleButton} size='sm' hidePopper>
          <ThemeIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem
            className={classes(styles.item, styles.light)}
            active={themeSetting === 'light'}
            eventKey='light'
          >
            <LightIcon />
            <span>Light</span>
          </DropdownItem>
          <DropdownItem
            className={classes(styles.item, styles.dark)}
            active={themeSetting === 'dark'}
            eventKey='dark'
          >
            <DarkIcon />
            <span>Dark</span>
          </DropdownItem>
          <DropdownItem
            className={classes(styles.item, styles.auto)}
            active={themeSetting === 'auto'}
            eventKey='auto'
          >
            <AutoIcon />
            <span>System default</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className={styles.inline}>
        <Button
          className={classes(
            styles.item,
            styles.light,
            themeSetting === 'light' && styles.active
          )}
          onClick={() => setThemeSetting('light')}
        >
          <LightIcon />
          <span>Light</span>
        </Button>
        <Button
          className={classes(
            styles.item,
            styles.dark,
            themeSetting === 'dark' && styles.active
          )}
          onClick={() => setThemeSetting('dark')}
        >
          <DarkIcon />
          <span>Dark</span>
        </Button>
        <Button
          className={classes(
            styles.item,
            styles.auto,
            themeSetting === 'auto' && styles.active
          )}
          onClick={() => setThemeSetting('auto')}
        >
          <AutoIcon />
          <span>System default</span>
        </Button>
      </div>
    </div>
  )
};

export default ThemeToggle;
