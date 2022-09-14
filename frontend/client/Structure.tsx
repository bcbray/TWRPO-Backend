import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useMedia } from 'react-use';
import { Outlet } from 'react-router';

import Nav from './Nav';
import Footer from './Footer';

const Structure: React.FC = () => {
  const isDark = useMedia('(prefers-color-scheme: dark)', false);
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ToastContainer
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
};

export default Structure;
