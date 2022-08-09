import React from 'react';
import { Helmet } from "react-helmet-async";
import { useLoading, isSuccess, isFailure } from './LoadingState';
import { LiveResponse } from './types';
import MultistreamMain from './MultistreamMain';
import Error from './Error';
import Loading from './Loading';

const MultistreamContainer: React.FunctionComponent<{}> = () => {
  // const [loadingState, onReload] = useLoading<Live>('https://vaeb.io:3030/live');
  const [loadingState, onReload] = useLoading<LiveResponse>('/live');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Multistream</title>
        <meta
          name='description'
          content='Multistream of all WildRP Twitch streams.'
        />
      </Helmet>
      <div className="content">
        {isSuccess(loadingState)
           ? <MultistreamMain data={loadingState.data} onReload={onReload} />
           : isFailure(loadingState)
            ? <Error onTryAgain={onReload} />
            : <Loading />
         }
      </div>
    </>
  )
}

export default MultistreamContainer;
