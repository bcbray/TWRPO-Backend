import React from 'react';
import { Row, Col} from 'react-bootstrap';

import styles from './StreamList.module.css';
import { Stream, FactionInfo } from './types';
import StreamCard from './StreamCard';

interface Props {
  streams: Stream[];
  factionInfos: {[key: string]: FactionInfo};
}

const StreamList: React.FC<Props> = ({ streams, factionInfos }) => {
  return (
    <>
    <Row className={styles.row}>
      {streams.map(stream => (
        <Col key={stream.channelName} xs={12} sm={6} md={4} lg={3}>
          <StreamCard
            stream={stream}
            factionInfos={factionInfos}
          />
        </Col>
      ))}
    </Row>
    </>
  );
};

export default StreamList;
