import React from 'react';
import { Button } from '@restart/ui';
import {
  Streamer,
  VideoSegment,
  CharacterInfo,
  OverrideSegmentRequest,
  OverrideMultipleSegmentsRequest,
  Stream,
  Server,
} from '@twrpo/types';

import styles from './OverrideMultipleSegmentsModal.module.css';

import { isFailure, isSuccess, fetchAndCheck } from './LoadingState';
import Modal from './Modal';
import Spinner from './Spinner';
import { classes } from './utils';
import { useStreamer, useServers } from './Data';
import { FancyDropdown, LineItem } from './FancyDropdown';
import DropdownItem from './DropdownItem';
import Tag from './Tag';
import { useFactionCss } from './FactionStyleProvider';
import { useCurrentServer, CurrentServerProvider } from './CurrentServer';
import { useSegmentTagText } from './SegmentTitleTag';
import { usePaginatedStreams } from './Streams';
import { useStreams } from './Data';
import { LoadTrigger, useRelativeDate } from './hooks';

interface OverrideMultipleSegmentsModalProps {
  streamerTwitchLogin: string;
  show: boolean;
  onHide: (overridden: boolean) => void;
}

interface LoadedProps {
  streamer: Streamer;
  characters: CharacterInfo[];
  servers: Server[];
  onHide: (overridden: boolean) => void;
}

interface CharacterLineItem extends LineItem {
  character?: CharacterInfo;
}

interface ServerLineItem extends LineItem {
  server?: Server;
}

const StreamRow: React.FC<{
  segment: VideoSegment,
  isSelected: boolean,
  toggleSelection: () => void,
  primaryServer: Server,
  overriddenCharacter: CharacterInfo | undefined | null,
  overriddenCharacterUncertain: boolean | undefined,
  overriddenServer: Server | undefined | null,
  overriddenServerUncertain: boolean | undefined,
  // overriddenIsHidden
}> = ({
  segment,
  isSelected,
  toggleSelection,
  primaryServer,
  overriddenCharacter,
  overriddenCharacterUncertain,
  overriddenServer,
  overriddenServerUncertain,
}) => {
  const serverForStyles = isSelected && overriddenServer !== undefined && overriddenServer !== null
    ? overriddenServer
    : segment.server ?? primaryServer;

  const displayedSelectedServer = isSelected && overriddenServer !== undefined
    ? overriddenServer
    : segment.server;

  const displayedServerUncertain = isSelected && overriddenServerUncertain !== undefined
      ? overriddenServerUncertain
      : segment.serverUncertain;

  const isPrimaryServer = displayedSelectedServer?.id === primaryServer.id;

  const displayedSelectedCharacter = isPrimaryServer
    ? isSelected && overriddenCharacter !== undefined
      ? overriddenCharacter
      : segment.character
    : null;
  const canBeUncertain = isPrimaryServer && displayedSelectedCharacter !== null;
  const displayedCharacterUncertain = !canBeUncertain
    ? false
    : isSelected && overriddenCharacterUncertain !== undefined
      ? overriddenCharacterUncertain
      : segment.characterUncertain;

  const startDate = React.useMemo(() => new Date(segment.startDate), [segment.startDate])

  const { full: fullDate, relative: relativeDate } = useRelativeDate(startDate);

  const partialEditedSegment: VideoSegment = React.useMemo(() => {
    const {
      character: oldCharacter,
      characterUncertain: oldCharacterUncertain,
      liveInfo: oldLiveInfo,
      server: oldServer,
      serverUncertain: oldServerUncertain,
      ...rest
    } = segment;
    let liveInfo: Stream | undefined;
    if (oldLiveInfo) {
      const {
        tagFaction: oldTagFaction,
        ...rest
      } = oldLiveInfo;
      liveInfo = {
        tagFaction: displayedSelectedCharacter
          ? displayedSelectedCharacter.factions[0]?.key ?? 'independent'
          : 'otherwrp',
        ...rest,
      }
    }
    return {
      ...rest,
      character: displayedSelectedCharacter,
      characterUncertain: displayedCharacterUncertain,
      server: displayedSelectedServer ?? undefined,
      serverUncertain: displayedServerUncertain,
      liveInfo,
    }
  }, [segment, displayedSelectedCharacter, displayedCharacterUncertain, displayedSelectedServer, displayedServerUncertain]);

  const editedTagText = useSegmentTagText(partialEditedSegment, serverForStyles, { ignoreLiveInfo: true });

  const { factionStylesForKey } = useFactionCss(serverForStyles);

  return (
    <div
      className={classes(
        styles.streamRow,
        isSelected && styles.selected
      )}
      onClick={toggleSelection}
    >
      <div>
        <input
          type='checkbox'
          checked={isSelected}
          onChange={() => {}}
          // onChange={() => toggleSelection()}
        />
      </div>
      <Tag
        as='span'
        className={styles.tag}
        style={factionStylesForKey(displayedSelectedCharacter?.factions[0]?.key ?? 'otherwrp')}
      >
        {editedTagText}
      </Tag>
      <Tag
        as='span'
        className={classes(styles.tag, styles.date)}
        title={fullDate}
      >
        {relativeDate}
      </Tag>
      <div
          className={styles.streamTitle}
          title={segment.title}
        >
          {segment.title}
      </div>
    </div>
  );
}

const FormContent: React.FC<LoadedProps> = ({
    streamer,
    characters,
    servers,
    onHide,
}) => {
  const { server: primaryServer } = useCurrentServer();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const [overriddenCharacter, setOverriddenCharacter] = React.useState<CharacterInfo | null | undefined>(undefined);
  const [overriddenCharacterUncertain, setOverriddenCharacterUncertain] = React.useState<boolean | undefined>(undefined);
  const [overriddenServer, setOverriddenServer] = React.useState<Server | null | undefined>(undefined);
  const [overriddenServerUncertain, setOverriddenServerUncertain] = React.useState<boolean | undefined>(undefined);
  const [overriddenIsHidden, setOverriddenIsHidden] = React.useState<boolean | undefined>(undefined);
  const [selectedSegmentIDs, setSelectedSegmentIDs] = React.useState(new Set<number>());

  const toggleSegmentID = React.useCallback((id: number) => {
    setSelectedSegmentIDs(ids => {
      const newIDs = new Set(ids);
      if (newIDs.has(id)) {
        newIDs.delete(id);
      } else {
        newIDs.add(id);
      }
      return newIDs;
    })
  }, []);

  const serverForStyles = overriddenServer ?? primaryServer;

  const { factionStylesForKey } = useFactionCss(serverForStyles);

  const displayedSelectedServer = overriddenServer === undefined
    ? primaryServer
    : overriddenServer;

  const displayedServerUncertain = overriddenServerUncertain === undefined
      ? false
      : overriddenServerUncertain;

  const isPrimaryServer = displayedSelectedServer?.id === primaryServer.id;

  const displayedSelectedCharacter = isPrimaryServer
    ? overriddenCharacter === undefined
      ? null
      : overriddenCharacter
    : null;
  const canBeUncertain = isPrimaryServer && displayedSelectedCharacter !== null;
  const displayedCharacterUncertain = !canBeUncertain
    ? false
    : overriddenCharacterUncertain === undefined
      ? false
      : overriddenCharacterUncertain;

  const displayedIsHidden = overriddenIsHidden === undefined
    ? false
    : overriddenIsHidden;

  const handleSubmit = React.useCallback(() => {
    setIsSubmitting(true);
    setHasError(false);

    const characterId = isPrimaryServer
      ? overriddenCharacter !== undefined
        ? overriddenCharacter?.id ?? null
        : undefined
      : null;
    const characterUncertain = isPrimaryServer
      ? overriddenCharacterUncertain ?? false
      : undefined;
    const serverId = overriddenServer !== undefined
      ? overriddenServer?.id ?? null
      : undefined;
    const serverUncertain = overriddenServerUncertain ?? false;
    const isHidden = overriddenIsHidden ?? false;

    const baseOverride: Omit<OverrideSegmentRequest, 'segmentId'> = {
      characterId,
      characterUncertain,
      serverId,
      serverUncertain,
      isHidden,
    };

    const request: OverrideMultipleSegmentsRequest = {
      overrides: [...selectedSegmentIDs].map(id => ({segmentId: id, ...baseOverride})),
    }

    fetchAndCheck('/api/v2/admin/override-multiple-segments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    .then(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      onHide(true);
    })
    .catch(() => {
      setIsSubmitting(false);
      setHasSubmitted(false);
      setHasError(true);
    })
  }, [overriddenCharacter, overriddenCharacterUncertain, overriddenServer, overriddenServerUncertain, overriddenIsHidden, isPrimaryServer, onHide, selectedSegmentIDs]);

  const characterLineItems: CharacterLineItem[] = React.useMemo(() => [
    {
      id: 'meta-none',
      name: 'No character',
      element: <DropdownItem
        key={'meta-none'}
        onClick={(e) => e.preventDefault()}
        eventKey={'meta-none'}
        active={displayedSelectedCharacter === undefined}
      >
        No character
      </DropdownItem>
    },
    ...characters.map(character => ({
      id: `${character.id}`,
      character,
      name: character.displayInfo.realNames.join(' '),
      element: <DropdownItem
        key={character.id}
        onClick={(e) => e.preventDefault()}
        eventKey={character.id}
        active={character.id === displayedSelectedCharacter?.id}
      >
        <Tag
          as='span'
          className={styles.tag}
          style={factionStylesForKey(character.factions[0]?.key)}
        >
          {character.displayInfo.displayName}
        </Tag>
        {' '}
        {character.displayInfo.realNames.join(' ')}
      </DropdownItem>
    }))
  ], [characters, factionStylesForKey, displayedSelectedCharacter]);

  const serverLineItems: ServerLineItem[] = React.useMemo(() => [
    {
      id: 'meta-none',
      name: 'No server',
      element: <DropdownItem
        key={'meta-none'}
        onClick={e => e.preventDefault()}
        eventKey='meta-none'
        active={displayedSelectedServer === undefined}
      >
        No server
      </DropdownItem>
    },
    ...servers.map(server => ({
      id: `${server.id}`,
      server,
      name: server.name,
      element: <DropdownItem
        key={server.id}
        onClick={e => e.preventDefault()}
        eventKey={server.id}
        active={server.id === displayedSelectedServer?.id}
      >
        {server.name}
      </DropdownItem>
    }))
  ], [servers, displayedSelectedServer]);

  const {
    streams,
    hasMore,
    loadMore,
    loadKey,
  } = usePaginatedStreams(useStreams, {
    channelTwitchId: streamer.twitchId,
    distinctCharacters: false,
    serverId: primaryServer.id,
  });

  return <CurrentServerProvider identifier={serverForStyles.id}>
    <div className={styles.header}>
      Edit segment
    </div>
    <div className={styles.body}>
      <div>
        <FancyDropdown
          className={styles.serverDropdown}
          buttonClassName={styles.serverDropdownButton}
          title={displayedSelectedServer?.name ?? 'No server'}
          items={serverLineItems}
          onSelect={item => setOverriddenServer(item?.server ?? null)}
        />
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            checked={displayedServerUncertain}
            onChange={e => setOverriddenServerUncertain(e.target.checked)}
          />
          {' '}
          Server uncertain
        </label>
      </div>
      <div>
        <FancyDropdown
          className={styles.characterDropdown}
          buttonClassName={styles.characterDropdownButton}
          title={displayedSelectedCharacter?.displayInfo.realNames.join(' ') ?? 'No character'}
          items={characterLineItems}
          onSelect={item => setOverriddenCharacter(item?.character ?? null)}
        />
      </div>
      <div>
        <label
          className={classes(
            !canBeUncertain && styles.disabled
          )}
        >
          <input
            type='checkbox'
            checked={displayedCharacterUncertain}
            disabled={!canBeUncertain}
            onChange={e => setOverriddenCharacterUncertain(e.target.checked)}
          />
          {' '}
          Character uncertain
        </label>
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            checked={displayedIsHidden}
            onChange={e => setOverriddenIsHidden(e.target.checked)}
          />
          {' '}
          Hide segment
        </label>
      </div>

      <div>
        {streams.map(s => (
          <StreamRow
            key={s.segment.id}
            segment={s.segment}
            isSelected={selectedSegmentIDs.has(s.segment.id)}
            toggleSelection={() => toggleSegmentID(s.segment.id)}
            primaryServer={primaryServer}
            overriddenCharacter={overriddenCharacter}
            overriddenCharacterUncertain={overriddenCharacterUncertain}
            overriddenServer={overriddenServer}
            overriddenServerUncertain={overriddenServerUncertain}
          />
        ))}
        {hasMore &&
          <div>
            {streams.length > 0 && hasMore
              ? <LoadTrigger key={loadKey} loadMore={loadMore} />
              : undefined
            }
            <Spinner />
          </div>
        }
      </div>

    </div>
    <div className={styles.footer}>
      {hasError &&
        <div className={styles.alert}>
          Unable to save changes. Please try again later.
        </div>
      }
      <Button
        className='button secondary'
        onClick={() => onHide(false)}
        disabled={isSubmitting || hasSubmitted}
      >
        Cancel
      </Button>
      <Button
        className='button primary'
        type='submit'
        disabled={isSubmitting || hasSubmitted}
        onClick={handleSubmit}
      >
        {isSubmitting || hasSubmitted
          ? <>
            <Spinner size='sm' className={styles.submitSpinner} as='span' />
            Saving…
          </>
          : `Save ${selectedSegmentIDs.size} override${selectedSegmentIDs.size === 1 ? '' : 's'}`
        }
      </Button>
    </div>
  </CurrentServerProvider>;
}

const ModalContent: React.FC<OverrideMultipleSegmentsModalProps> = ({
  streamerTwitchLogin,
  onHide,
}) => {
  const [streamerLoadState] = useStreamer(streamerTwitchLogin);
  // const [segmentLoadState] = useSegment(segmentId, { skipsPreload: true });
  const [serverLoadState] = useServers();
  if (isSuccess(streamerLoadState) && isSuccess(serverLoadState)) {
    return <FormContent
      streamer={streamerLoadState.data.streamer}
      characters={streamerLoadState.data.characters}
      servers={serverLoadState.data.servers}
      onHide={onHide}
    />
  }
  if (isFailure(streamerLoadState)) {
    return <p>Failed.</p>
  }
  return <p>Loading.</p>
}

const OverrideMultipleSegmentsModal: React.FC<OverrideMultipleSegmentsModalProps> = (props) => {
  const {
    show,
    onHide,
  } = props;
  return (
    <Modal
      dialogClassName={styles.dialog}
      contentClassName={styles.content}
      show={show}
      onHide={() => onHide(false)}
    >
      <ModalContent {...props} />
    </Modal>
  );
};

export default OverrideMultipleSegmentsModal;
