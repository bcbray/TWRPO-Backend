import React from 'react';
import { NavLink } from 'react-router-dom';
import { classes } from './utils';

import styles from './Nav.module.css';

const Nav: React.FC<{}> = () => {
  return (
    <div className={styles.navbar}>
      <div className={classes('inset', styles.container)}>
        <NavLink className={styles.brand} to='/'>Twitch WildRP Only</NavLink>
        <div className={styles.links}>
          <a
            className={classes('button', 'primary', styles.extension)}
            role='button'
            href='https://chrome.google.com/webstore/detail/twitch-wildrp-only/jnbgafpjnfoocapahlkjihjecoaaaikd'
          >
            Get Extension
          </a>
          <div className={styles.nav}>
            <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/'>Live</NavLink>
            <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/characters'>Characters</NavLink>
            <NavLink className={({isActive}) => classes(isActive && styles.active)} to='/multistream'>Multistream</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
