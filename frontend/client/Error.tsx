import React from 'react';
import { Button } from '@restart/ui';

import styles from './Error.module.css';
import { classes } from './utils';

interface ErrorProps {
  onTryAgain?: () => void;
}

const Error: React.FC<ErrorProps> = ({ onTryAgain }) => {
  return (
    <div className={classes('inset', styles.content)}>
      <p>Failed to load data. Please try again later.</p>
      {onTryAgain &&
        <Button
          className={classes('button', 'primary')}
          onClick={onTryAgain}
        >
          Try again
        </Button>
      }
    </div>
  );
};

export default Error;
