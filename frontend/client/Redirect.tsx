import React from 'react';
import { useIsSSR } from '@restart/ui/ssr';
import { Navigate, To, useHref } from 'react-router';

import { SSRRoutingContext } from './SSRRouting';

interface RedirectProps {
  to: To;
}

const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const isSSR = useIsSSR();
  const context = React.useContext(SSRRoutingContext);
  context.redirect = useHref(to);;

  return isSSR ? <></> : <Navigate to={to} />;
};

export default Redirect;
