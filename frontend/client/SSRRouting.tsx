import React from 'react';

export interface SSRRouting {
  notFound?: boolean;
  redirect?: string;
};

export const SSRRoutingContext = React.createContext<SSRRouting>({});

export const SSRRoutingProvider = SSRRoutingContext.Provider;

export const useNotFound = () => {
  const context = React.useContext(SSRRoutingContext);
  context.notFound = true;
}
