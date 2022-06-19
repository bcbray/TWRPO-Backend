import React from 'react';
import { Container, Spinner, Row, Col} from 'react-bootstrap';
import { Helmet } from "react-helmet-async";
import { useLoading, isSuccess, isFailure } from './LoadingState';
import { CharactersResponse } from './types';
import MultistreamMain from './MultistreamMain';

const MultistreamContainer: React.FunctionComponent<{}> = () => {
  const [loadingState] = useLoading<CharactersResponse>('/api/v2/characters');
  return (
    <>
      <Helmet>
        <title>Twitch WildRP Only - Multistream</title>
      </Helmet>
      <Container className="my-5">
        {isSuccess(loadingState)
           ? <MultistreamMain data={loadingState.data} />
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

export default MultistreamContainer;
