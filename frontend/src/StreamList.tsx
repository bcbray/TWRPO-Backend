import React from 'react';
import { Row, Col} from 'react-bootstrap';

import styles from './StreamList.module.css';
import { Stream } from './types';
import StreamCard from './StreamCard';

interface Props {
  streams: Stream[];
  factionColors: {[key: string]: { dark: string, light: string}};
}

const StreamList: React.FC<Props> = ({ streams, factionColors }) => {
  return (
    <>
    <Row className={styles.row}>
      {streams.map(stream => (
        <Col key={stream.channelName} xs={12} sm={6} md={4} lg={3}>
          <StreamCard
            stream={stream}
            factionColors={factionColors}
          />
        </Col>
      ))}
    </Row>
    </>
  );
};

export default StreamList;
