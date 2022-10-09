import React from 'react';
import PlausibleTracker from 'plausible-tracker';
import type { PlausibleOptions } from 'plausible-tracker';

const PlausibleContext = React.createContext<ReturnType<typeof PlausibleTracker> | null>(null);

const noopTracker: ReturnType<typeof PlausibleTracker> = {
  trackEvent: () => {},
  trackPageview: () => {},
  enableAutoPageviews: () => () => {},
  enableAutoOutboundTracking: () => () => {},
};

export const usePlausible = () => {
  const plausible = React.useContext(PlausibleContext);
  return plausible ?? noopTracker;
}

export const Plausible: React.FC<React.PropsWithChildren<PlausibleOptions>> = ({children, ...options}) => {
  const plausible = React.useMemo(() => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      return PlausibleTracker(options);
    } else {
      return noopTracker;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => plausible.enableAutoPageviews(), [plausible]);
  return <PlausibleContext.Provider value={plausible}>
    {children}
  </PlausibleContext.Provider>;
}
