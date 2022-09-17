import React from 'react';
import { Button } from '@restart/ui';

import styles from './Login.module.css';

import { useAuthentication } from './auth';
import { classes } from './utils';
import LoginButton from './LoginButton';

interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {
  const { user, logout } = useAuthentication();

  return (
    <div
      className={classes(
        'content',
        'inset',
        styles.content,
      )}
    >
      {user ? (
        <>
          <h2>You're signed in as {user.displayName}</h2>
          <Button
            className='button primary'
            onClick={logout}
          >
            Sign out
          </Button>
        </>
      ) : (
        <>
          <h2>Sign in</h2>
          <p>If you’re not sure why you’re here you won’t get much out of this.</p>
          <LoginButton />
        </>
      )}
    </div>
  );
};

export default Login;
