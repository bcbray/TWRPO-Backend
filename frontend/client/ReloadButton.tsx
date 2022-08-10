import React from 'react';
import { Button } from '@restart/ui';
import { ArrowClockwise } from 'react-bootstrap-icons';

import styles from './RelaodButton.module.css';

interface Props {
  onClick: () => void;
}

const ReloadButton: React.FC<Props> = ({ onClick }) => (
  <Button
    className={styles.reload}
    title='Reload'
    onClick={onClick}
  >
    <ArrowClockwise style={{ display: 'block' }} />
  </Button>
);

export default ReloadButton;
