import React from 'react';

import { isSuccess, isFailure, LoadingResult } from './LoadingState';
import Error from './Error'
import Loading from './Loading';

interface LoadedProps<T> {
  data: T;
  reload?: () => void;
  loadTick?: number
}

interface LoadContainerProps<T> {
  loader: () => LoadingResult<T>;
  content: React.JSXElementConstructor<LoadedProps<T>>;
}

export default function LoadContainer<T>({
  loader,
  content: Content,
  ...rest
}: LoadContainerProps<T>) {
  const [loadState, reload, loadTick] = loader();

  return (
    <div className='content inset'>
      {isSuccess(loadState)
        ? <Content data={loadState.data} reload={reload} loadTick={loadTick} {...rest} />
        : isFailure(loadState)
          ? <Error onTryAgain={reload} />
          : <Loading />
      }
    </div>
  );
};
