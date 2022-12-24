import React from 'react';
import { Button } from '@restart/ui';
import { Twitch } from 'react-bootstrap-icons';

import styles from './LoginButton.module.css';

import { useAuthentication } from './auth';
import { classes } from './utils';

interface LoginButtonProps {
  disabled?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  disabled = false,
}) => {
  const { login } = useAuthentication();
  return (
    <Button
      className={classes(
        'button',
        styles.twitchLogin
      )}
      disabled={disabled}
      onClick={login}
    >
      <Twitch /> Sign in with Twitch
    </Button>
  );
};

export default LoginButton;
