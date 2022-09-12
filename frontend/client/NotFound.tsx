import React from 'react';
import { Helmet } from "react-helmet-async";

import { classes } from './utils';
import { useNotFound } from './SSRRouting';

interface NotFoundProps {
  alreadyContent?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({
  alreadyContent = false,
}) => {
  useNotFound();

  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Not Found</title>
      </Helmet>
      <div className={classes(
        !alreadyContent && 'content',
        'inset',
      )}>
        <h3>Not found.</h3>
        <p>Couldn't find the page you were looking for. Sorry.</p>
      </div>
    </>
  );
};

export default NotFound;
