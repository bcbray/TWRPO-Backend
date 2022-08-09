import React from 'react';
import { Helmet } from "react-helmet-async";

import { SSRRoutingContext } from './SSRRouting';

const NotFound: React.FunctionComponent<{}> = () => {
  const context = React.useContext(SSRRoutingContext);
  context.notFound = true;

  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Not Found</title>
      </Helmet>
      <div className='content inset'>
        <h3>Not found.</h3>
        <p>Couldn't find the page you were looking for. Sorry.</p>
      </div>
    </>
  );
};

export default NotFound;
