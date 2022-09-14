import React from 'react';
import { Button } from '@restart/ui';
import { Twitch } from 'react-bootstrap-icons';

import styles from './Login.module.css';

import { useAuth } from './auth';
import { classes } from './utils';

interface LoginProps {

}

const Login: React.FC<LoginProps> = () => {
  const { user, login, logout } = useAuth();

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
          <Button
            className={classes(
              'button',
              styles.twitchLogin
            )}
            onClick={login}
          >
            <Twitch /> Sign in with Twitch
          </Button>
        </>
      )}
    </div>
  );
};

export default Login;
