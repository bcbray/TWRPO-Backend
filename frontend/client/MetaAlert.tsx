import React from 'react';
import { Button } from '@restart/ui';

import Modal from './Modal';
import { classes } from './utils';

import styles from './MetaAlert.module.css';

interface MetaAlertProps {
  show: boolean;
  onHide: (selection: 'cancel' | 'agree') => void;
}

const MetaAlert: React.FC<MetaAlertProps> = ({
  show,
  onHide,
}) => {
  return (
    <Modal
      show={show}
      onHide={() => onHide('cancel')}
      backdrop='static'
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
          onClick={() => onHide('agree')}
        >
          Agree
        </Button>
      </div>
    </Modal>
  );
};

export default MetaAlert;
