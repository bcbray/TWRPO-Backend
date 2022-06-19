import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons'

interface Props {
  onClick: () => void;
}

const ReloadButton: React.FC<Props> = ({ onClick }) => (
  <Button
    title='Reload'
    className="p-0"
    variant='reload'
    onClick={onClick}
  >
    <ArrowClockwise style={{ display: 'block' }} />
  </Button>
);

export default ReloadButton;
