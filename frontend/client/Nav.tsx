import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@restart/ui';
import { Server } from '@twrpo/types';

import styles from './Nav.module.css';

import { classes } from './utils';
import ThemeToggle from './ThemeToggle';
import { Collapse } from './Transitions';
import UserDropdown from './UserDropdown';
import { useCurrentServer } from './CurrentServer';
import { useServers } from './Data';
import { isSuccess } from './LoadingState';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import { useAuthorization } from './auth';

interface NavProps {
  setServer: (server: Server | null) => void;
}

interface ServerLineItem extends LineItem {
  server?: Server;
}

const Nav: React.FC<NavProps> = ({ setServer }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { server } = useCurrentServer();
  const canViewServerPicker = useAuthorization('view-root-server-picker');
  const [serversLoadState] = useServers({ needsLoad: canViewServerPicker });

  const serverLineItems: ServerLineItem[] = React.useMemo(() => {
    if (isSuccess(serversLoadState)) {
      return [
        ...serversLoadState.data.servers.map(s => ({
          id: `${s.id}`,
          server: s,
          name: s.name,
          foo: s.id === server?.id,
          element: <DropdownItem
            key={`${s.id}`}
            onClick={e => e.preventDefault()}
            eventKey={`${s.id}`}
            active={s.id === server?.id}
          >
            {s.name}
          </DropdownItem>
        }))
      ]
    } else {
      return []
    }
  }, [serversLoadState, server]);

  return (
    <div className={styles.navbar}>
      <div className={classes('inset', styles.container)}>
        <NavLink className={styles.brand} to='/'>Twitch WildRP Only</NavLink>
        {canViewServerPicker &&
          <FancyDropdown
            className={styles.serverDropdown}
            title={server.name}
            items={serverLineItems}
            onSelect={item => setServer(item?.server ?? null)}
          />
        }
        <Button
          className={classes(
            styles.toggler,
            collapsed && styles.collapsed
          )}
          onClick={() => setCollapsed(c => !c)}
        >
          <span></span>
        </Button>
        <Collapse
          in={!collapsed}
        >
          <div
            className={classes(
              styles.links,
            )}
          >
            <a
              className={classes('button', 'primary', styles.extension)}
              role='button'
              href='https://chrome.google.com/webstore/detail/twitch-wildrp-only/jnbgafpjnfoocapahlkjihjecoaaaikd'
            >
              Get Extension
            </a>
            <div className={styles.nav}>
              <ThemeToggle className={styles.themeToggle} />
              <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/'>Live</NavLink>
              <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/characters'>Characters</NavLink>
              <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/multistream'>Multistream</NavLink>
              <UserDropdown className={styles.userDropdown} />
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Nav;
