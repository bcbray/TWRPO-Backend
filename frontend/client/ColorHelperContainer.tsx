import React from 'react';
import { Helmet } from "react-helmet-async";
import { CharactersResponse } from '@twrpo/types';

import { useLoading, isSuccess, isFailure } from './LoadingState';
import ColorHelper from './ColorHelper';
import Error from './Error';
import Loading from './Loading';

const ColorHelperContainer: React.FC<{}> = () => {
  const [loadingState, reload] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Colors</title>
        <meta
          name='description'
          content='Utility for configuring Twitch WildRP Only faction colors.'
        />
      </Helmet>
      <div className='content'>
        {isSuccess(loadingState)
          ? <ColorHelper data={loadingState.data} />
          : isFailure(loadingState)
            ? <Error onTryAgain={reload} />
            : <Loading />
         }
      </div>
    </>
  )
};

export default ColorHelperContainer;
