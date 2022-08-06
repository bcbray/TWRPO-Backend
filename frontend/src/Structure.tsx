import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useMedia } from 'react-use';

import Nav from './Nav';

interface Props {
  children: React.ReactNode;
}

const Structure: React.FC<Props> = ({ children }) => {
  const isDark = useMedia('(prefers-color-scheme: dark)', false);
  return (
    <>
      <Nav />
      {children}
      <ToastContainer
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
};

export default Structure;
