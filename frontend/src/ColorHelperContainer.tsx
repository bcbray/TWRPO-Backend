import React from 'react';
import { Container, Spinner, Row, Col} from 'react-bootstrap';
import { Helmet } from "react-helmet-async";

import { useLoading, isSuccess, isFailure } from './LoadingState';
import { CharactersResponse } from './types';
import ColorHelper from './ColorHelper';

const ColorHelperContainer: React.FC<{}> = () => {
  const [loadingState] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Colors</title>
        <meta
          name='description'
          content='Utility for configuring Twitch WildRP Only faction colors.'
        />
      </Helmet>
      <Container className="my-5">
        {isSuccess(loadingState)
           ? <ColorHelper data={loadingState.data} />
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
};

export default ColorHelperContainer;
