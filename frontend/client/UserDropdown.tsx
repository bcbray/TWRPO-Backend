import React from 'react';
import { Button } from '@restart/ui';
import { BoxArrowLeft } from 'react-bootstrap-icons';

import styles from './UserDropdown.module.css';

import { useAuthentication } from './auth';
import ProfilePhoto from './ProfilePhoto';
import Dropdown from './Dropdown';
import DropdownButton from './DropdownButton';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';
import { classes } from './utils';

interface UserDropdownProps {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  className,
}) => {
  const { user, logout } = useAuthentication();
  if (!user) return null;

  return (
    <div
      className={className}
    >
      <Dropdown
        className={styles.dropdown}
        placement='bottom-end'
      >
        <DropdownButton
          className={styles.userButton}
          title={user.displayName}
          size='sm'
          hidePopper
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
        </DropdownButton>
        <DropdownMenu className={styles.menu}>
          <div className={classes(styles.user, styles.item)}>
            <ProfilePhoto
              className={styles.pfp}
              channelInfo={{
                id: user.twitchId,
                login: user.twitchLogin,
                displayName: user.displayName,
                profilePictureUrl: user.profilePhotoUrl,
              }}
              size={40}
            />
            {user.displayName}
          </div>
          <DropdownItem
            className={styles.item}
            eventKey='light'
            onClick={logout}
          >
            <BoxArrowLeft />
            <span>Log out</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className={styles.inline}>
        <div className={classes(styles.user, styles.item)}>
          <ProfilePhoto
            className={styles.pfp}
            channelInfo={{
              id: user.twitchId,
              login: user.twitchLogin,
              displayName: user.displayName,
              profilePictureUrl: user.profilePhotoUrl,
            }}
            size={20}
          />
          {user.displayName}
        </div>
        <div className={styles.divider} />
        <Button
          className={classes(
            styles.item,
          )}
          onClick={logout}
        >
          <BoxArrowLeft />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default UserDropdown;
