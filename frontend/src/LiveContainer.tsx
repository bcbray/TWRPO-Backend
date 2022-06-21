import React from 'react';
import { Container, Spinner, Row, Col} from 'react-bootstrap';
import { Helmet } from "react-helmet-async";

import { useLoading, isSuccess, isFailure } from './LoadingState';
import { LiveResponse } from './types';
import Live from './Live';
import Nav from './Nav';

const LiveContainer: React.FC = () => {
  const [loadingState] = useLoading<LiveResponse>('/live');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only</title>
      </Helmet>
      <Nav />
      <Container className="mt-5">
        {isSuccess(loadingState)
           ? <Live data={loadingState.data} />
           : isFailure(loadingState)
             ? <Row className="justify-content-center">
                 <Col xs="auto"><p>Failed to load data. Please try again later.</p></Col>
              </Row>
             : <Row className="justify-content-center">
                 <Col xs="auto"><Spinner animation="border" /></Col>
              </Row>
         }
      </Container>
    </>
  );
};

export default LiveContainer;
