import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';

export const environmentKey = '__TWRPO_ENVIRONMENT__';

export interface Environment {
  datadogEnvironment: string;
  datadogVersion?: string;
  rootUrl: string;
}

const EnvironmentContext = React.createContext<Environment | null>(null);

const fallbackEnvironment: Environment = {
  datadogEnvironment: 'prod',
  rootUrl: 'https://twrponly.tv',
};

export const ServerEnvironmentProvider: React.FC<React.PropsWithChildren<Environment>> = ({ children, ...environment }) =>
  <EnvironmentContext.Provider value={environment}>
    {children}
  </EnvironmentContext.Provider>;

export const ClientEnvironmentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (useIsSSR()) {
    console.error('ClientEnvironmentProvider should not be used on the server');
  }

  const environment = React.useMemo(() => {
    if (environmentKey in window) {
      return (window as any)[environmentKey] as Environment;
    } else {
      console.error('Missing environemnt');
      return fallbackEnvironment;
    }
  }, []);

  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = (): Environment => {
  let env = React.useContext(EnvironmentContext);
  if (!env) {
    console.error('Missing an EnvironmentProvider');
    env = fallbackEnvironment;
  }
  return env;
};
