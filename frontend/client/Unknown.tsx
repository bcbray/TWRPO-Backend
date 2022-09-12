import React from 'react';
import { UnknownResponse, Streamer, VideoSegment } from '@twrpo/types';

import styles from './Unknown.module.css';

import StreamList from './StreamList'
import { classes } from './utils';

interface UnknownProps {
  data: UnknownResponse;
}

const Unknown: React.FC<UnknownProps> = ({ data }) => {
  const unknown: [Streamer, VideoSegment][] = data.unknown.map(({streamer, segment}) => [streamer, segment]);
  const uncertain: [Streamer, VideoSegment][] = data.uncertain.map(({streamer, segment}) => [streamer, segment]);
  return (
    <div className={classes('inset', styles.container)}>
      <div>
        <h2>Unknown</h2>
        <StreamList
          streams={[]}
          pastStreams={unknown}
          paginationKey='unknown'
          loadTick={0}
          noInset
        />
      </div>
      <div>
        <h2>Uncertain</h2>
        <StreamList
          streams={[]}
          pastStreams={uncertain}
          paginationKey='uncertain'
          loadTick={0}
          noInset
        />
      </div>
    </div>
  );
};

export default Unknown;
