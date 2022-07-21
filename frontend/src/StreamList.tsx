import React from 'react';
import { Row, Col} from 'react-bootstrap';

import styles from './StreamList.module.css';
import { Stream, CharacterInfo, FactionInfo } from './types';
import StreamCard from './StreamCard';
import OfflineCharacterCard from './OfflineCharacterCard';

interface Props {
  streams: Stream[];
  offlineCharacters?: CharacterInfo[]
  factionInfos: {[key: string]: FactionInfo};
  loadTick: number;
}

const StreamList: React.FC<Props> = ({ streams, offlineCharacters, factionInfos, loadTick }) => {
  return (
    <>
    <Row className={styles.row}>
      {streams.map(stream => (
        <Col key={stream.channelName} xs={12} sm={6} md={4} lg={3}>
          <StreamCard
            stream={stream}
            factionInfos={factionInfos}
            loadTick={loadTick}
          />
        </Col>
      ))}
      {offlineCharacters && offlineCharacters.map(character => (
        <Col key={`${character.channelName}_${character.name}`} xs={12} sm={6} md={4} lg={3}>
          <OfflineCharacterCard
            className={styles.offline}
            character={character}
            factionInfos={factionInfos}
          />
        </Col>
      ))}
    </Row>
    </>
  );
};

export default StreamList;
