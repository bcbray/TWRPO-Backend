import React from 'react';
import { Helmet } from "react-helmet-async";

import { useLoading, useAutoReloading, isSuccess, isFailure } from './LoadingState';
import { LiveResponse, CharactersResponse } from './types';
import Live from './Live';
import Error from './Error';
import Loading from './Loading';

const LiveContainer: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveLoadingState, reloadLive, lastLoad] = useAutoReloading<LiveResponse>('/api/v1/live');
  const [charactersLoadingState, reloadCharacters] = useLoading<CharactersResponse>('/api/v2/characters');
  const reload = () => {
    if (isFailure(liveLoadingState)) {
      reloadLive();
    }
    if (isFailure(charactersLoadingState)) {
      reloadCharacters();
    }
  };

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
        {isSuccess(liveLoadingState) && isSuccess(charactersLoadingState)
          ? <Live live={liveLoadingState.data} characters={charactersLoadingState.data} loadTick={lastLoad} />
          : isFailure(liveLoadingState) || isFailure(charactersLoadingState)
            ? <Error onTryAgain={reload} />
            : <Loading />
         }
      </div>
    </>
  );
};

export default LiveContainer;
