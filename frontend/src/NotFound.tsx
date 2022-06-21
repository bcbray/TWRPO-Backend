import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from "react-helmet-async";

const NotFound: React.FunctionComponent<{}> = () => {
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Not Found</title>
      </Helmet>
      <Container className="mt-5">
        <h3>Not found.</h3>
        <p>Couldn't find the page you were looking for. Sorry.</p>
      </Container>
    </>
  );
};

export default NotFound;
