import React from 'react';

export interface SSRRouting {
  notFound?: boolean;
  redirect?: string;
};

export const SSRRoutingContext = React.createContext<SSRRouting>({});

export const SSRRoutingProvider = SSRRoutingContext.Provider;
