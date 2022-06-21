import React from 'react';
import { LinkContainer, LinkContainerProps } from 'react-router-bootstrap';
import { PathMatch, Location } from 'react-router';

const PrefixLinkContainer: React.FC<{ to: string} & Omit<LinkContainerProps, 'isActive' | 'to'>> = ({ to, ...props }) => {
  return <LinkContainer
    to={to}
    isActive={(_: PathMatch<string>, location: Location) => location.pathname.startsWith(to) }
    {...props}
  />
};

export default PrefixLinkContainer;
