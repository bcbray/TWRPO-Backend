import React from 'react';
import { useEffectOnce } from 'react-use';
import { User } from '@twrpo/types';

import styles from './auth.module.css';

import { isSuccess } from './LoadingState';
import { useCurrentUser } from './Data';

export interface UserInfo {
  user?: User;
  login: () => void;
  logout: () => void;
}

const UserContext = React.createContext<UserInfo | null>(null);

export const UserProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const popup = React.useRef<Window | null>(null);

  const [loadingState, reload] = useCurrentUser({
    ignoreReloadFailures: false,
  });

  const login = React.useCallback(() => {
    if (popup.current) {
      popup.current.close();
    }
    if (typeof window === 'undefined') {
      return;
    }
    const top = window.top ?? window;
    const width = 600;
    const height = 800;
    const x = top.outerWidth / 2 + top.screenX - ( width / 2);
    const y = top.outerHeight / 2 + top.screenY - ( height / 2);
    popup.current = window.open('/auth/twitch', '_blank', `width=${width}, height=${height}, top=${y}, left=${x}`)
  }, []);

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

  const receiveMessage = React.useCallback((event: MessageEvent<AuthPopupMessage>) => {
    if (event.origin !== window.location.origin) {
      return;
    }
    if (event.data.isa !== 'auth-message') {
      return;
    }
    if (event.data.type === 'auth-complete') {
      // TODO: Do something if auth failed?
      reload();
    } else if (event.data.type === 'auth-close') {
      popup.current?.close();
      popup.current = null;
    }
  }, [reload]);

  React.useEffect(() => {
    window.addEventListener('message', receiveMessage, true);
    return () => {
      window.removeEventListener('message', receiveMessage, true);
    };
  }, [receiveMessage]);

  const userResponse = isSuccess(loadingState) ? loadingState.data : undefined;

  const info: UserInfo = React.useMemo(() => ({
    user: userResponse?.user ?? undefined,
    login,
    logout,
  }), [userResponse?.user, login, logout]);

  return <UserContext.Provider value={info}>
    {children}
  </UserContext.Provider>
}

export const useAuthentication = (): UserInfo => {
  const userInfo = React.useContext(UserContext);
  if (!userInfo) {
    console.error('Missing UserProvider');
    return {
      login: () => {},
      logout: () => {},
    };
  }
  return userInfo;
}

interface OverrideSegmentAuthorization {
  type: 'overide-segment';
  twitchId: string;
}

type ServerEditAuthorization = 'server-edit';

type ViewOtherSegmentsAuthorization = 'view-all-segments';

type EditUsersAuthorization = 'edit-users';

type ViewRootServerPicker = 'view-root-server-picker';

type ViewStreamerTimeseries = 'view-streamer-timeseries';

type ViewAllContactsAuthorization = 'view-all-contacts';

type AuthorizationType = OverrideSegmentAuthorization | ServerEditAuthorization | ViewOtherSegmentsAuthorization | EditUsersAuthorization | ViewRootServerPicker | ViewStreamerTimeseries | ViewAllContactsAuthorization;

export const useAuthorization = (type: AuthorizationType): boolean => {
  const { user } = useAuthentication();
  if (!user) {
    return false;
  }
  if (type === 'server-edit' || type === 'view-all-segments' || type === 'edit-users' || type === 'view-root-server-picker' || type === 'view-streamer-timeseries') {
    return user.globalRole === 'admin';
  } else if (type === 'view-all-contacts' || type.type === 'overide-segment') {
    return user.globalRole === 'admin' || user.globalRole === 'editor';
  }
  return user.globalRole === 'admin';
}

interface AuthCompleteMessage {
  isa: 'auth-message';
  type: 'auth-complete';
  success: boolean;
}

interface AuthCloseMessage {
  isa: 'auth-message';
  type: 'auth-close'
}

type AuthPopupMessage = AuthCompleteMessage | AuthCloseMessage;

export const AuthComplete: React.FC<{ success: boolean }> = ({ success }) => {
  useEffectOnce(() => {
    if (typeof window ==='undefined' || !window.opener) {
      return;
    }
    const completeMessage: AuthCompleteMessage = { isa: 'auth-message', type: 'auth-complete', success };
    window.opener.postMessage(completeMessage, window.location.origin);
    setTimeout(() => {
      const closeMessage: AuthCloseMessage = { isa: 'auth-message', type: 'auth-close' };
      window.opener.postMessage(closeMessage, window.location.origin);
    }, 1500);
  });

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
