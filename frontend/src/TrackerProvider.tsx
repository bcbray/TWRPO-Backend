import React from 'react';
import Datadog from 'react-datadog';

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
      defaultPrivacyLevel='allow'
      sessionReplayRecording
    >
      {children}
    </Datadog>
  );
};

export default TrackerProvider;
