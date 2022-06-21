import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMatomo } from '@jonkoops/matomo-tracker-react';

const PageviewTracker: React.FC<{}> = () => {
  const location = useLocation();
  const { trackPageView } = useMatomo()

  React.useEffect(() => {
    trackPageView();
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
};

export default PageviewTracker;
