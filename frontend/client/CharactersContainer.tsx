import React from 'react';
import Characters from './Characters';
import { Helmet } from "react-helmet-async";
import { useLoading, isSuccess, isFailure } from './LoadingState';
import { CharactersResponse } from './types';
import Error from './Error';
import Loading from './Loading';

const CharactersContainer: React.FunctionComponent<{}> = () => {
  const [loadingState, reload] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Characters</title>
        <meta
          name='description'
          content='Known WildRP streamers and their characters.'
        />
      </Helmet>
      <div className='content'>
        {isSuccess(loadingState)
          ? <Characters data={loadingState.data} />
          : isFailure(loadingState)
            ? <Error onTryAgain={reload} />
            : <Loading />
         }
      </div>
    </>
  )
}

export default CharactersContainer;
