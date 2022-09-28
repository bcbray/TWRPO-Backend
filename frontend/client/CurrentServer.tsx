import React from 'react';
import { ServerResponse } from '@twrpo/types';

import { isSuccess, isFailure } from './LoadingState';
import { useServer } from './Data';
import ErrorComponent from './Error';
import Loading from './Loading';

const CurrentServerContext = React.createContext<ServerResponse | null>(null);

interface CurrentServerProviderProps {
  identifier: string | number;
  children: React.ReactNode;
}

export const CurrentServerProvider: React.FC<CurrentServerProviderProps> = ({ identifier, children }) => {
  const [serverLoadState, reload] = useServer(identifier);

  if (isSuccess(serverLoadState)) {
    return (
      <CurrentServerContext.Provider value={serverLoadState.data}>
        {children}
      </CurrentServerContext.Provider>
    );
  }
  return (
    <div className='content inset'>
      {isFailure(serverLoadState) ? (
        <ErrorComponent onTryAgain={reload} />
      ) : (
        <Loading />
      )}
    </div>
  )
};

export const useCurrentServer = (): ServerResponse => {
  const currentServerContext = React.useContext(CurrentServerContext);
  if (currentServerContext === null) {
    throw new Error('useCurrentServer must be nested in a CurrentServerProvider');
  }
  return currentServerContext;
}
