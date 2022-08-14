import React from 'react';
import { TransitionGroup } from 'react-transition-group';

import styles from './Crossfade.module.css';

import { Fade } from './Transitions';
import { classes } from './utils';

interface CrossfadeProps {
  className?: string;
  fadeKey: any;
  children: React.ReactElement;
}

const Crossfade: React.FC<CrossfadeProps> = ({
  className,
  fadeKey,
  children,
}) => {
  return (
    <TransitionGroup
      className={classes(
        className,
        styles.container,
      )}
    >
      <Fade key={fadeKey}>
        {children}
      </Fade>
    </TransitionGroup>
  );
};

export default Crossfade;
