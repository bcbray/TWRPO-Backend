import React from 'react';
import { Helmet } from "react-helmet-async";
import { toast, Id as ToastId } from 'react-toastify';
import { Button } from '@restart/ui';

import { useAutoreloadLive } from './Data';
import { isSuccess, isFailure } from './LoadingState';
import Live from './Live';
import Error from './Error';
import Loading from './Loading';

interface ToastProps {
  paused: boolean;
  onTogglePause: () => void;
}

const LoadFailedToast: React.FC<ToastProps> = ({ paused, onTogglePause }) => {
  return <div>
    Failed to reload streams<br />
    <Button as='a' onClick={onTogglePause}>{paused ? 'Resume autoreload' : 'Pause autoreload'}</Button>
  </div>;
}

const LiveContainer: React.FC = () => {
  const [autoreloadPaused, setAutoreloadPaused] = React.useState(false);

  const toastId = React.useRef<ToastId | null>(null);

  const dismissToastIfVisible = React.useCallback(() => {
    if (toastId.current && toast.isActive(toastId.current)) {
      toast.dismiss(toastId.current);
    }
  }, []);

  const showToast = React.useCallback(() => {
    dismissToastIfVisible();
    toastId.current = toast.error(
    <LoadFailedToast paused={autoreloadPaused} onTogglePause={() => setAutoreloadPaused(p => !p)} />,
    {
      closeOnClick: false,
      autoClose: autoreloadPaused ? false : undefined,
      pauseOnFocusLoss: false,
    });
  }, [dismissToastIfVisible, autoreloadPaused]);

  const updateToastIfVisible = React.useCallback(() => {
    if (toastId.current === null || !toast.isActive(toastId.current)) {
      return false;
    }
    toast.update(toastId.current, {
      render: () => <LoadFailedToast paused={autoreloadPaused} onTogglePause={() => setAutoreloadPaused(p => !p)} />,
      autoClose: autoreloadPaused ? false : undefined,
      closeOnClick: false,
      pauseOnFocusLoss: false,
    })
    return true;
  }, [autoreloadPaused]);

  const onReloadFailed = React.useCallback(() => {
    // First, try and keep a visible toast around, if there wasn't one, show a new toast
    if (!updateToastIfVisible()) {
      showToast();
    }
  }, [showToast, updateToastIfVisible]);

  // Whenever our definition of updating a toast changes, make sure to apply the update immediately
  React.useEffect(() => {
    updateToastIfVisible();
  }, [updateToastIfVisible]);

  const [liveLoadingState, reloadLive, lastLoad] = useAutoreloadLive({
    needsLoad: !autoreloadPaused,
    onReloadFailed,
    onReloadSuccess: dismissToastIfVisible,
  });

  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only</title>
        <meta
          name='description'
          content='All live WildRP streams. Twitch WildRP Only is a website and browser extension for finding WildRP streams on Twitch.'
        />
      </Helmet>
      <div className="content">
        {isSuccess(liveLoadingState)
          ? <Live live={liveLoadingState.data} loadTick={lastLoad} />
          : isFailure(liveLoadingState)
            ? <Error onTryAgain={reloadLive} />
            : <Loading />
         }
      </div>
    </>
  );
};

export default LiveContainer;
