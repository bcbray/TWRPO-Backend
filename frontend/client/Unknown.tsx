import React from 'react';
import { UnknownResponse, Streamer, VideoSegment } from '@twrpo/types';

import styles from './Unknown.module.css';

import StreamList from './StreamList'
import { classes } from './utils';

interface UnknownProps {
  data: UnknownResponse;
  handleRefresh: () => void;
}

const Unknown: React.FC<UnknownProps> = ({ data, handleRefresh }) => {
  const unknown: [Streamer, VideoSegment][] = data.unknown.map(({streamer, segment}) => [streamer, segment]);
  const uncertain: [Streamer, VideoSegment][] = data.uncertain.map(({streamer, segment}) => [streamer, segment]);
  return (
    <div className={classes('inset', styles.container)}>
      <div>
        <h2>Unknown</h2>
        <StreamList
          streams={[]}
          segments={unknown}
          paginationKey='unknown'
          loadTick={0}
          noInset
          dimPastStreams={false}
          showLiveBadge
          handleRefresh={handleRefresh}
        />
      </div>
      <div>
        <h2>Uncertain</h2>
        <StreamList
          streams={[]}
          segments={uncertain}
          paginationKey='uncertain'
          loadTick={0}
          noInset
          dimPastStreams={false}
          showLiveBadge
          handleRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Unknown;
