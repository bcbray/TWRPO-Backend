import React from 'react';
import { useParams } from "react-router-dom";

import { useStreamer } from './Data';
import { isSuccess, isFailure, NotFoundError } from './LoadingState';
import Streamer from './Streamer';
import Error from './Error';
import Loading from './Loading';
import NotFound from './NotFound';

interface StreamerContainerProps {

}

const StreamerContainer: React.FC<StreamerContainerProps> = () => {
  const params = useParams();
  const { streamerName } = params;
  const [loadState, reload, loadTick] = useStreamer(streamerName ?? '');

  return (
    <div className="content">
      {isSuccess(loadState)
        ? <Streamer data={loadState.data} loadTick={loadTick} handleRefresh={reload} />
        : isFailure(loadState)
          ? loadState.error instanceof NotFoundError
            ? <NotFound alreadyContent />
            : <Error onTryAgain={reload} />
          : <Loading />
       }
    </div>
  );
};

export default StreamerContainer;
