import React from 'react';
import { LinkContainer, LinkContainerProps } from 'react-router-bootstrap';
import { useMatch } from 'react-router';

const PrefixLinkContainer: React.FC<{ to: string} & Omit<LinkContainerProps, 'isActive' | 'to'>> = ({ to: path, ...props }) => {
  let match = useMatch({ path, end: false });
  return <LinkContainer
    to={path}
    isActive={match !== null}
    {...props}
  />
};

export default PrefixLinkContainer;
