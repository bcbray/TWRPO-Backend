import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Server } from '@twrpo/types';

import styles from './ServerStreams.module.css';

import { useServers } from './Data';
import { isSuccess } from './LoadingState';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import { useCurrentServer, CurrentServerProvider } from './CurrentServer';
import Streams from './Streams';
import Timeseries from './Timeseries';

interface ServerStreamsProps {

}

interface ServerLineItem extends LineItem {
  server?: Server;
}

const ServerStreams: React.FC<ServerStreamsProps> = () => {
  const primaryServer = useCurrentServer();
  const navigate = useNavigate();
  const params = useParams();
  const { serverId: serverIdParam } = params;
  const serverId = serverIdParam !== undefined ? Number.parseInt(serverIdParam) : primaryServer.server.id;
  const [serversLoadState] = useServers();

  const selectedServer = serverId && isSuccess(serversLoadState)
    ? serversLoadState.data.servers.find(server => server.id === serverId)
    : undefined;

  const serverLineItems: ServerLineItem[] = React.useMemo(() => {
    if (isSuccess(serversLoadState)) {
      return [
        ...serversLoadState.data.servers.map(server => ({
          id: `${server.id}`,
          server,
          name: server.name,
          foo: server.id === serverId,
          element: <DropdownItem
            key={`${server.id}`}
            onClick={e => e.preventDefault()}
            eventKey={`${server.id}`}
            active={server.id === serverId}
          >
            {server.name}
          </DropdownItem>
        }))
      ]
    } else {
      return []
    }
  }, [serversLoadState, serverId]);

  return (
    <div className='content inset'>
      <FancyDropdown
        className={styles.serverDropdown}
        title={selectedServer ? selectedServer.name : primaryServer.server.name}
        items={serverLineItems}
        onSelect={item => navigate(`/utils/streams/server${item && item.server && item.server.id !== primaryServer.server.id ? `/${item.server.id}` : ''}`)}
      />
      {selectedServer ? (
        <CurrentServerProvider identifier={selectedServer?.id}>
          <Timeseries />
          <Streams noInset distinctCharacters={false} />
        </CurrentServerProvider>
      ) : (
        <>
          <Timeseries />
          <Streams noInset distinctCharacters={false} />
        </>
      )}
    </div>
  );
};

export default ServerStreams;
