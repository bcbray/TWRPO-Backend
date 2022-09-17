import React from 'react';

import { useAuthentication } from './auth';
import LoginButton from './LoginButton';

interface UnauthorizedProps {

}

const Unauthorized: React.FC<UnauthorizedProps> = () => {
  const { user } = useAuthentication();
  if (user) {
    return <>
      <h3>Unauthorized.</h3>
      <p>You don’t have access to this page.</p>
    </>;
  }
  return <>
    <h3>Unauthorized.</h3>
    <p>You don’t have access to this page.</p>
    <LoginButton />
  </>
};

export default Unauthorized;
