import React from 'react';
import { Link } from 'react-router-dom';
import { UsersResponse } from '@twrpo/types';

import styles from './Users.module.css';

import LoadContainer from './LoadContainer';
import { useUsers } from './Data';
import { useAuthorization } from './auth';
import Unauthorized from './Unauthorized';
import ProfilePhoto from './ProfilePhoto';

interface UsersProps {
  data: UsersResponse;
}

const Users: React.FC<UsersProps> = ({
  data: { users },
}) => {
  const isAuthorized = useAuthorization('edit-users');

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return <>
    <h2 className={styles.header}>
      Users
    </h2>
    <div>
      {users.map(user => (
        <div key={user.id} className={styles.user}>
          <Link to={`/streamer/${user.twitchLogin}`}>
            <ProfilePhoto
              className={styles.pfp}
              channelInfo={user}
              size={24}
              style={{
                height: '1.5rem',
                width: '1.5rem',
                borderRadius: '0.75rem',
              }}
            />
            {user.displayName}
          </Link>
          <span className={styles.role}>{user.globalRole}</span>
        </div>
      ))}
    </div>
  </>;
};

export const UsersContainer: React.FC = () =>
  <LoadContainer loader={useUsers} content={Users} />

export default Users;
