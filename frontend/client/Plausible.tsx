import React from 'react';
import PlausibleTracker from 'plausible-tracker';
import type { PlausibleOptions } from 'plausible-tracker';

export type PlausibleStuff = ReturnType<typeof PlausibleTracker>;

const PlausibleContext = React.createContext<ReturnType<typeof PlausibleTracker> | null>(null);

export const usePlausible = () => {
  const plausible = React.useContext(PlausibleContext);
  return plausible ?? {
    trackEvent: () => {},
    trackPageview: () => {},
    enableAutoPageviews: () => () => {},
    enableAutoOutboundTracking: () => () => {},
  };
}

export const Plausible: React.FC<React.PropsWithChildren<PlausibleOptions>> = ({children, ...options}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plausible = React.useMemo(() => PlausibleTracker(options), []);
  React.useEffect(() => plausible.enableAutoPageviews(), [plausible]);
  React.useEffect(() => plausible.enableAutoOutboundTracking(), [plausible]);
  return <PlausibleContext.Provider value={plausible}>
    {children}
  </PlausibleContext.Provider>;
}
