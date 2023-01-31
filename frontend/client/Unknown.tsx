import React from 'react';
import { UnknownResponse } from '@twrpo/types';

import styles from './Unknown.module.css';

import StreamList from './StreamList'
import { classes } from './utils';

interface UnknownProps {
  data: UnknownResponse;
  handleRefresh: () => void;
}

const Unknown: React.FC<UnknownProps> = ({ data, handleRefresh }) => {
  const factionsByKey = React.useMemo(() => (
    Object.fromEntries([
      ...data.unknown.flatMap(s => s.segment.character?.factions.map(f => [f.key, f]) ?? []),
      ...data.uncertain.flatMap(s => s.segment.character?.factions.map(f => [f.key, f]) ?? []),
    ])
  ), [data]);
  return (
    <div className={classes('inset', styles.container)}>
      <div>
        <h2>Unknown</h2>
        <StreamList
          streams={[]}
          segments={data.unknown}
          paginationKey='unknown'
          loadTick={0}
          noInset
          pastStreamStyle={'vivid'}
          showLiveBadge
          handleRefresh={handleRefresh}
          factionsByKey={factionsByKey}
        />
      </div>
      <div>
        <h2>Uncertain</h2>
        <StreamList
          streams={[]}
          segments={data.uncertain}
          paginationKey='uncertain'
          loadTick={0}
          noInset
          pastStreamStyle={'vivid'}
          showLiveBadge
          handleRefresh={handleRefresh}
          factionsByKey={factionsByKey}
        />
      </div>
    </div>
  );
};

export default Unknown;
