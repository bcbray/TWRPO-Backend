import React from 'react';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

const instance = createInstance({
  urlBase: 'https://twrponly.matomo.cloud/',
  siteId: 1,
});

interface Props {
  children?: React.ReactNode;
}

const TrackerProvider: React.FC<Props> = ({ children }) => {
  if (process.env.REACT_APP_IS_DEVELOPMENT === 'true') {
    return <>{children}</>;
  }
  return (
    <MatomoProvider value={instance}>
      {children}
    </MatomoProvider>
  );
};

export default TrackerProvider;
