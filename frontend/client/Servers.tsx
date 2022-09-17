import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { useUpdateEffect } from 'react-use';
import { Button } from '@restart/ui';
import axios from 'axios';
import { toast } from 'react-toastify';
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
  data: { servers: originalServers },
}) => {
  const isAuthorized = useAuthorization('server-edit');
  const [sortedServers, setSortedServers] = React.useState(originalServers);
  const [flipKey, setFlipKey] = React.useState(0);

  useUpdateEffect(() => setSortedServers(originalServers), [originalServers]);

  const isMoved = React.useMemo(() => {
    if (sortedServers.length !== originalServers.length) {
      console.error('We lost track of a server');
      return true;
    }
    for (let i = 0; i < sortedServers.length; i++) {
      if (sortedServers[i].id !== originalServers[i].id) {
        return true;
      }
    }
    return false;
  }, [sortedServers, originalServers]);

  const moveServer = React.useCallback((source: number, destination: number) => {
    setSortedServers((servers) => {
      const sorted = [...servers];
      const [moved] = sorted.splice(source, 1);
      sorted.splice(destination, 0, moved);
      return sorted;
    });
    // setFlipKey(flipKey => flipKey + 1);
  }, []);

  const [isSaving, setIsSaving] = React.useState(false);

  const reset = React.useCallback(() => {
    setSortedServers(originalServers);
    setFlipKey(flipKey => flipKey + 1);
  }, [originalServers]);

  const save = React.useCallback(() => {
    setIsSaving(true);
    const ids = sortedServers.map(server => server.id);
    axios
      .post('/api/v2/admin/reorder-servers', { ids })
      .then((reply) => {
        if (reply.data.success !== true) {
          throw Error('Invalid response');
        }
        toast.info('Saved!');
      })
      .catch(() => {
        toast.error('Error saving. Please try again.');
      })
      .finally(() => {
        setIsSaving(false);
      })
  }, [sortedServers]);

  // /v2/admin/reorder-servers

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return <>
    <h2 className={styles.header}>
      <span className={styles.text}>Servers</span>
      <Button className='button secondary' disabled={!isMoved || isSaving} onClick={reset}>Reset</Button>
      <Button className='button primary' disabled={!isMoved || isSaving} onClick={save}>Save</Button>
    </h2>
    <DragDropContext
      onDragEnd={({ source, destination}) => {
        if (!destination) {
          return;
        }
        moveServer(source.index, destination.index);
        // moveFaction(source.index, destination.index);
      }}
    >
      <Flipper flipKey={flipKey}>
        <Droppable droppableId={'servers'}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes(styles.list, isSaving && styles.saving)}
            >
              {sortedServers.map((server, index) => (
                <Draggable
                  isDragDisabled={isSaving}
                  key={server.id}
                  draggableId={`${server.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Flipped
                      flipId={server.id}
                    >
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classes(
                          styles.server,
                          snapshot.isDragging && styles.dragging,
                          !server.isVisible && styles.notVisible
                        )}
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
                    </Flipped>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Flipper>
    </DragDropContext>
  </>;
};

export const ServersContainer: React.FC = () =>
  <LoadContainer loader={useServers} content={Servers} />

export default Servers;
