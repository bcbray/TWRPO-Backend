import React from 'react';
import { Button } from '@restart/ui';
import { Twitch } from 'react-bootstrap-icons';

import styles from './LoginButton.module.css';

import { useAuthentication } from './auth';
import { classes } from './utils';

interface LoginButtonProps {

}

const LoginButton: React.FC<LoginButtonProps> = () => {
  const { login } = useAuthentication();
  return (
    <Button
      className={classes(
        'button',
        styles.twitchLogin
      )}
      onClick={login}
    >
      <Twitch /> Sign in with Twitch
    </Button>
  );
};

export default LoginButton;
