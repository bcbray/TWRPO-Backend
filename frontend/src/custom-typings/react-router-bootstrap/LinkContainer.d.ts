import React from 'react';
import { NavLinkProps } from 'react-router-dom';
import { PathMatch, Location } from 'react-router';

export interface LinkContainerProps extends NavLinkProps {
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  isActive?: boolean | ((match: PathMatch<string> | null, location: Location) => boolean);
}

type LinkContainer = React.ComponentClass<LinkContainerProps>;
declare const LinkContainer: LinkContainer;

export default LinkContainer;
