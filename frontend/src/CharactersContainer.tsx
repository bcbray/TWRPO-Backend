import React from 'react';
import Characters from './Characters';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import { Helmet } from "react-helmet-async";
import { useLoading, isSuccess, isFailure } from './LoadingState';
import { CharactersResponse } from './types';

const CharactersContainer: React.FunctionComponent<{}> = () => {
  const [loadingState] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Characters</title>
        <meta
          name='description'
          content='Known WildRP streamers and their characters.'
        />
      </Helmet>
      <Container className="my-5">
        {isSuccess(loadingState)
           ? <Characters data={loadingState.data} />
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
  )
}

export default CharactersContainer;
