import React from 'react';

import styles from './Footer.module.css';
import { classes } from './utils';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className={classes(styles.footer, 'inset')}>
      <p>Twitch WildRP Only is a fan-made site and has no affiliation with WildRP, Twitch, or the streamers listed here.</p>
    </div>
  );
};

export default Footer;
