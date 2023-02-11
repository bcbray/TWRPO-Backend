import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useMedia } from 'react-use';
import { Server } from '@twrpo/types';

import Nav from './Nav';
import Footer from './Footer';

interface StructureProps {
  setServer: (server: Server | null) => void;
}

const Structure: React.FC<React.PropsWithChildren<StructureProps>> = ({ setServer, children }) => {
  const isDark = useMedia('(prefers-color-scheme: dark)', false);
  return (
    <>
      <Nav setServer={setServer} />
      {children}
      <Footer />
      <ToastContainer
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
};

export default Structure;
