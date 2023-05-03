import React from 'react';
import { Button } from '@restart/ui';

import Modal from './Modal';
import { classes } from './utils';

import styles from './MetaAlert.module.css';

export type MetaAlertDecision = 'cancel' | 'agree' | 'agree-and-dont-show-again';

interface MetaAlertProps {
  show: boolean;
  onHide: (selection: MetaAlertDecision) => void;
}

const MetaAlert: React.FC<MetaAlertProps> = ({
  show,
  onHide,
}) => {
  const [dontWarnAgain, setDontWarnAgain] = React.useState(false);
  const dontWarnAgainId = React.useId();

  return (
    <Modal
      show={show}
      onHide={() => onHide('cancel')}
      backdrop='static'
      onExited={() => setDontWarnAgain(false)}
      centered
    >
      <div className={styles.header}>
        Meta Ahead
      </div>
      <div className={styles.body}>
        <p>
          Like all information on this site, telegram numbers are considered meta.
          If you play on WildRP, you should probably turn away now. By continuing
          you agree to not use information you learn here in{'\u2011'}game.
        </p>
        <div className={styles.formCheckbox}>
          <input
            id={dontWarnAgainId}
            type='checkbox'
            checked={dontWarnAgain}
            onChange={e => setDontWarnAgain(e.target.checked)}
          />
          <label htmlFor={dontWarnAgainId}>
            Don’t warn me again
          </label>
        </div>
      </div>
      <div className={styles.footer}>
        <Button
          className={classes('button', 'secondary')}
          onClick={() => onHide('cancel')}
        >
          Cancel
        </Button>
        <Button
          className={classes('button', 'primary')}
          onClick={() => onHide(dontWarnAgain ? 'agree-and-dont-show-again' : 'agree')}
        >
          Agree
        </Button>
      </div>
    </Modal>
  );
};

export default MetaAlert;
