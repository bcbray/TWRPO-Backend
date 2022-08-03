import React from 'react';
import { Helmet } from "react-helmet-async";

import { useAutoReloading, isSuccess, isFailure } from './LoadingState';
import { LiveResponse } from './types';
import Live from './Live';
import Error from './Error';
import Loading from './Loading';

const LiveContainer: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveLoadingState, reloadLive, lastLoad] = useAutoReloading<LiveResponse>('/api/v1/live');

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
