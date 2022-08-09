import React from 'react';
import { LinkContainer, LinkContainerProps } from 'react-router-bootstrap';
import { matchPath, useLocation } from 'react-router';

type Match = { path: string, prefix?: boolean } | string

interface Props {
  to: string;
  prefix?: boolean;
  or?: Match | Match[];
}

const PrefixLinkContainer: React.FC<Props & Omit<LinkContainerProps, 'isActive' | 'to'>> = ({ to: path, prefix = false, or: others = [], ...props }) => {
  let { pathname } = useLocation();

  // TODO: Memoize (but be weary of object comparisons)
  const hasMatch = (matchPath({ path, end: !prefix }, pathname) !== null)
    || (others instanceof Array ? others : [others]).some((other) => {
      const path = (typeof other === 'object')
        ? { path: other.path, end: !(other.prefix === undefined ? prefix : other.prefix) }
        : { path: other, end: !prefix }
      return (matchPath(path, pathname) !== null);
    });

  return <LinkContainer
    to={path}
    isActive={hasMatch}
    {...props}
  />
};

export default PrefixLinkContainer;
