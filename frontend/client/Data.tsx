import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';

import { useAutoReloading, AutoReloadingProps } from './LoadingState';
import { LiveResponse } from './types'

export interface PreloadedData {
  live?: LiveResponse;
  usedLive?: boolean;
}

export const preloadedLiveDataKey = '__PRELOADED_LIVE_DATA__';

export const PreloadedDataContext = React.createContext<PreloadedData>({});

export const ServerPreloadedDataProvider = PreloadedDataContext.Provider;

export const ClientPreloadedDataProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (useIsSSR()) {
    console.error('ClientPreloadedDataProvider should not be used on the server');
  }

  const live = preloadedLiveDataKey in window
    ? (window as any)[preloadedLiveDataKey] as LiveResponse
    : undefined;

  return <PreloadedDataContext.Provider value={{ live }}>
    {children}
  </PreloadedDataContext.Provider>
}

export const useAutoreloadLive = (props: AutoReloadingProps<LiveResponse> = {}) => {
  const preloadedContext = React.useContext(PreloadedDataContext);
  if (props.needsLoad !== false && preloadedContext.live && !props.preloaded) {
    preloadedContext.usedLive = true;
  }
  return useAutoReloading('/api/v1/live', {
    preloaded: preloadedContext.live,
    ...props,
  });
};
