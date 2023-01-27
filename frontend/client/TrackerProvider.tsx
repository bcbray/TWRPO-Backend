import React from 'react';
import Datadog from 'react-datadog';

import { Plausible } from './Plausible'

interface Props {
  children?: React.ReactNode;
}

const TrackerProvider: React.FC<Props> = ({ children }) => {
  if (process.env.REACT_APP_IS_DEVELOPMENT === 'true') {
    return <>{children}</>;
  }
  return (
    <Datadog
      applicationId='40c94581-de63-42af-b32b-c4f383897c3d'
      clientToken='pub28eb54281f13367423106a5fbcdf7461'
      site='us3.datadoghq.com'
      service='twrponly.tv'
      env={process.env.REACT_APP_DD_ENV ?? 'dev'}
      version={process.env.REACT_APP_DD_VERSION}
      defaultPrivacyLevel='allow'
      sessionReplayRecording
      allowedTracingOrigins={
        process.env.REACT_APP_APPLICATION_HOST
        ? [`https://${process.env.REACT_APP_APPLICATION_HOST}`]
        : [`https://twrponly.tv`]
      }
    >
      <Plausible>
        {children}
      </Plausible>
    </Datadog>
  );
};

export default TrackerProvider;
