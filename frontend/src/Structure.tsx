import React from 'react';

import Nav from './Nav';

interface Props {
  children: React.ReactNode;
}

const Structure: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
    </>
  );
};

export default Structure;
