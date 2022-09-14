import React from 'react';
import { Button } from '@restart/ui';
import { PencilFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import styles from './OverrideSegmentButton.module.css';

import OverrideSegmentModal from './OverrideSegmentModal';
import { useAuthorization } from './auth';
import { classes } from './utils';

interface OverrideSegmentButtonProps {
  className?: string;
  streamerTwitchLogin: string;
  segmentId: number;
}

const OverrideSegmentButton: React.FC<OverrideSegmentButtonProps> = ({
  className,
  streamerTwitchLogin,
  segmentId,
}) => {
  const [showingModal, setShowingModal] = React.useState(false);
  const canOverride = useAuthorization({
    type: 'overide-segment',
    twitchId: streamerTwitchLogin,
  });
  const showSavedToast = React.useCallback(() => (
    toast.info('Segment edited! It will be updated in the next refresh (within 1 minute)')
  ), []);

  if (!canOverride) {
    return null;
  }

  return <>
    <Button
      className={classes(
        className,
        styles.button,
      )}
      onClick={() => setShowingModal(true)}
    >
      <PencilFill />
    </Button>
    <OverrideSegmentModal
      streamerTwitchLogin={streamerTwitchLogin}
      segmentId={segmentId}
      show={showingModal}
      onHide={(saved) => {
        if (saved) {
          showSavedToast();
        }
        setShowingModal(false);
      }}
    />
  </>
};

export default OverrideSegmentButton;
