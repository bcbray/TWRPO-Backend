import React from 'react';
import Characters from './Characters';
import { Helmet } from "react-helmet-async";
import { isSuccess, isFailure } from './LoadingState';
import { useCharacters } from './Data';
import Error from './Error';
import Loading from './Loading';
import { useCurrentServer } from './CurrentServer';

const CharactersContainer: React.FunctionComponent<{}> = () => {
  const { server } = useCurrentServer();
  const [loadingState, reload] = useCharacters({ serverId: server.id });
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
