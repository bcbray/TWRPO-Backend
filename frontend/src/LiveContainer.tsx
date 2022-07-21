import React from 'react';
import { Container, Spinner, Row, Col} from 'react-bootstrap';
import { Helmet } from "react-helmet-async";

import { useLoading, useAutoReloading, isSuccess, isFailure } from './LoadingState';
import { LiveResponse, CharactersResponse } from './types';
import Live from './Live';

const LiveContainer: React.FC = () => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [liveLoadingState, _, lastLoad] = useAutoReloading<LiveResponse>('/api/v1/live');
  const [charactersLoadingState] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only</title>
        <meta
          name='description'
          content='All live WildRP streams. Twitch WildRP Only is a website and browser extension for finding WildRP streams on Twitch.'
        />
      </Helmet>
      <Container className="mt-5">
        {isSuccess(liveLoadingState) && isSuccess(charactersLoadingState)
           ? <Live live={liveLoadingState.data} characters={charactersLoadingState.data} loadTick={lastLoad} />
           : isFailure(liveLoadingState) || isFailure(charactersLoadingState)
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
