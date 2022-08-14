import React from 'react';
import { TransitionGroup } from 'react-transition-group';

import styles from './Crossfade.module.css';

import { Fade } from './Transitions';
import { classes } from './utils';

interface CrossfadeProps {
  className?: string;
  fadeKey: any;
  children: React.ReactElement;
  fadeOver?: boolean;
}

const Crossfade: React.FC<CrossfadeProps> = ({
  className,
  fadeKey,
  fadeOver = false,
  children,
}) => {
  return (
    <TransitionGroup
      className={classes(
        className,
        styles.container,
        fadeOver && styles.fadeOver,
      )}
    >
      <Fade
        key={fadeKey}
        statusClassNames={{
          'exiting': classes(fadeOver && styles.fadeOver)
        }}
        direction={fadeOver ? 'only-fade-in' : 'both'}
      >
        {children}
      </Fade>
    </TransitionGroup>
  );
};

export default Crossfade;
