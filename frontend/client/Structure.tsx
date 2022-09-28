import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useMedia } from 'react-use';

import Nav from './Nav';
import Footer from './Footer';

const Structure: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isDark = useMedia('(prefers-color-scheme: dark)', false);
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <ToastContainer
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
};

export default Structure;
