import React from 'react';
import { User } from '@twrpo/types';

import { isSuccess } from './LoadingState';
import { useCurrentUser } from './Data';

export interface UserInfo {
  user?: User;
  logout: () => void;
}

const UserContext = React.createContext<UserInfo | null>(null);

export const UserProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [loadingState, reload] = useCurrentUser({
    ignoreReloadFailures: false,
  });
  const logout = React.useCallback(() => {
    fetch('/auth/logout', { method: 'POST' })
      .then(() => {
        reload();
      })
      .catch((error) => {
        // TODO: Show a toast or something?
        console.error(error);
      })
  }, [reload]);

  const info: UserInfo = React.useMemo(() => ({
    user: isSuccess(loadingState) ? loadingState.data : undefined,
    logout,
  }), [loadingState, logout]);

  return <UserContext.Provider value={info}>
    {children}
  </UserContext.Provider>
}

export const useAuth = (): UserInfo => {
  const userInfo = React.useContext(UserContext);
  if (!userInfo) {
    console.error('Missing UserProvider');
    return { logout: () => {} };
  }
  return userInfo;
}

export const AuthComplete: React.FC<{ success: boolean }> = ({ success }) => {
  return (
    <div className={styles.container}>
      {success ? (
        <h2>Sign in complete</h2>
      ) : (
        <h2>Sign in failed</h2>
      )}
      <p>This window will close automatically.</p>
    </div>
  );
};
