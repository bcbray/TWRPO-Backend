import React from 'react';
import { Button } from '@restart/ui';

import styles from './UserDropdown.module.css';

import { useAuth } from './auth';
import ProfilePhoto from './ProfilePhoto';

interface UserDropdownProps {
}

const UserDropdown: React.FC<UserDropdownProps> = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <Button
      className={styles.userButton}
      onClick={logout}
      title={user.displayName}
    >
      <ProfilePhoto
        className={styles.pfp}
        channelInfo={{
          id: user.twitchId,
          login: user.twitchLogin,
          displayName: user.displayName,
          profilePictureUrl: user.profilePhotoUrl,
        }}
      />
      <span className={styles.name}>
        {user.displayName}
      </span>
    </Button>
  );
};

export default UserDropdown;
