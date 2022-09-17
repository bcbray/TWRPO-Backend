import React from 'react';
import { ServersResponse } from '@twrpo/types';

import styles from './Servers.module.css';

import LoadContainer from './LoadContainer';
import { useServers } from './Data';
import Regex from './Regex';
import { classes } from './utils';
import { useAuthorization } from './auth';
import Unauthorized from './Unauthorized';

interface ServersProps {
  data: ServersResponse;
}

const Servers: React.FC<ServersProps> = ({
  data: { servers },
}) => {
  const [expandedServerIds, setExpandedServerIds] = React.useState<number[]>([]);
  const isAuthorized = useAuthorization('server-edit');

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return <>
    <h2 className={styles.header}>Servers</h2>
    <div className={styles.list}>
    {servers.map((server) => {
      const isExpanded = expandedServerIds.includes(server.id);
      return (
        <div
          key={server.id}
          className={classes(!server.isVisible && styles.notVisible)}
          onClick={() => {
            setExpandedServerIds(ids => isExpanded ? ids.filter(id => id !== server.id) : [...ids, server.id])
          }}
        >
          <h3>
            <span>{server.name}</span> {server.liveCount > 0 && <span className={styles.liveCount}>({server.liveCount} live)</span>}
          </h3>
          {server.regexes.map(regex =>
            <div key={regex.id} className={styles.regex}>
              <Regex source={regex.regex} flags={regex.isCaseSensitive ? [] : ['case-insensitive']} />
            </div>
          )}
        </div>
      );
    })}
    </div>
  </>;
};

export const ServersContainer: React.FC = () =>
  <LoadContainer loader={useServers} content={Servers} />

export default Servers;
