import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@restart/ui';

import styles from './Nav.module.css';

import { classes } from './utils';
import ThemeToggle from './ThemeToggle';
import { Collapse } from './Transitions';
import { useAuth } from './auth';
import ProfilePhoto from './ProfilePhoto'

const Nav: React.FC<{}> = () => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { user, logout } = useAuth();

  return (
    <div className={styles.navbar}>
      <div className={classes('inset', styles.container)}>
        <NavLink className={styles.brand} to='/'>Twitch WildRP Only</NavLink>
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
              {user &&
                <Button
                  className={styles.userButton}
                  onClick={logout}
                  title={user.displayName}
                >
                  <ProfilePhoto channelInfo={{
                    id: user.twitchId,
                    login: user.twitchLogin,
                    displayName: user.displayName,
                    profilePictureUrl: user.profilePhotoUrl,
                  }} />
                </Button>
              }
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Nav;
