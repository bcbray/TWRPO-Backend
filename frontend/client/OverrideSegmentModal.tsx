import React from 'react';
import { Button } from '@restart/ui';
import {
  Streamer,
  VideoSegment,
  CharacterInfo,
  OverrideSegmentRequest,
  Stream,
  Server,
} from '@twrpo/types';

import styles from './OverrideSegmentModal.module.css';

import { isFailure, isSuccess, fetchAndCheck } from './LoadingState';
import Modal from './Modal';
import Spinner from './Spinner';
import { classes } from './utils';
import { useStreamer, useSegment, useServers } from './Data';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import VideoSegmentCard from './VideoSegmentCard'
import Tag from './Tag'
import { useFactionCss } from './FactionStyleProvider';
import { useCurrentServer } from './CurrentServer';
import { useSegmentTagText } from './SegmentTitleTag';

interface OverrideSegmentModalProps {
  streamerTwitchLogin: string;
  segmentId: number;
  show: boolean;
  onHide: (overridden: boolean) => void;
}

interface LoadedProps {
  streamer: Streamer;
  segment: VideoSegment;
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

const FormContent: React.FC<LoadedProps> = ({
    streamer,
    segment,
    characters,
    servers,
    onHide,
}) => {
  const { factionStylesForKey } = useFactionCss();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const { server: primaryServer } = useCurrentServer();

  const [overriddenCharacter, setOverriddenCharacter] = React.useState<CharacterInfo | null | undefined>(undefined);
  const [overriddenCharacterUncertain, setOverriddenCharacterUncertain] = React.useState<boolean | undefined>(undefined);
  const [overriddenServer, setOverriddenServer] = React.useState<Server | null | undefined>(undefined);
  const [overriddenServerUncertain, setOverriddenServerUncertain] = React.useState<boolean | undefined>(undefined);
  const [overriddenIsHidden, setOverriddenIsHidden] = React.useState<boolean | undefined>(undefined);

  const displayedSelectedServer = overriddenServer === undefined
    ? segment.server
    : overriddenServer;

  const displayedServerUncertain = overriddenServerUncertain === undefined
      ? segment.serverUncertain
      : overriddenServerUncertain;

  const isPrimaryServer = displayedSelectedServer?.id === primaryServer.id;

  const displayedSelectedCharacter = isPrimaryServer
    ? overriddenCharacter === undefined
      ? segment.character
      : overriddenCharacter
    : null;
  const canBeUncertain = isPrimaryServer && displayedSelectedCharacter !== null;
  const displayedCharacterUncertain = !canBeUncertain
    ? false
    : overriddenCharacterUncertain === undefined
      ? segment.characterUncertain
      : overriddenCharacterUncertain;

  const displayedIsHidden = overriddenIsHidden === undefined
    ? segment.isHidden ?? false
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
      ? overriddenCharacterUncertain
      : segment.characterUncertain
        ? false
        : undefined;
    const serverId = overriddenServer !== undefined
      ? overriddenServer?.id ?? null
      : undefined;
    const serverUncertain = overriddenServerUncertain;
    const isHidden = overriddenIsHidden;

    const request: OverrideSegmentRequest = {
      segmentId: segment.id,
      characterId,
      characterUncertain,
      serverId,
      serverUncertain,
      isHidden,
    }
    fetchAndCheck('/api/v2/admin/override-segment', {
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
  }, [segment.id, overriddenCharacter, overriddenCharacterUncertain, overriddenServer, overriddenServerUncertain, overriddenIsHidden, isPrimaryServer, segment.characterUncertain, onHide]);

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

  const editedTagText = useSegmentTagText(partialEditedSegment, { ignoreLiveInfo: true });

  const editedSegment: VideoSegment = React.useMemo(() => {
    const {
      liveInfo: oldLiveInfo,
      ...rest
    } = partialEditedSegment;
    let liveInfo: Stream | undefined;
    if (oldLiveInfo) {
      const {
        tagText: oldTagText,
        ...rest
      } = oldLiveInfo;
      liveInfo = {
        tagText: editedTagText,
        ...rest,
      }
    }
    return {
      ...rest,
      liveInfo,
    }
  }, [partialEditedSegment, editedTagText]);

  return <>
    <div className={styles.header}>
      Edit segment
    </div>
    <div className={styles.body}>
      <div>
        <VideoSegmentCard
          className={styles.card}
          streamer={streamer}
          segment={editedSegment}
          wrapTitle
          noEdit
          pastStreamStyle={'vivid'}
          handleRefresh={() => {}}
          factionsByKey={{}}
        />
      </div>
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
          : 'Save'
        }
      </Button>
    </div>
  </>;
}

const ModalContent: React.FC<OverrideSegmentModalProps> = ({
  streamerTwitchLogin,
  segmentId,
  onHide,
}) => {
  const [streamerLoadState] = useStreamer(streamerTwitchLogin);
  const [segmentLoadState] = useSegment(segmentId, { skipsPreload: true });
  const [serverLoadState] = useServers();
  if (isSuccess(streamerLoadState) && isSuccess(segmentLoadState) && isSuccess(serverLoadState)) {
    return <FormContent
      streamer={streamerLoadState.data.streamer}
      segment={segmentLoadState.data}
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

const OverrideSegmentModal: React.FC<OverrideSegmentModalProps> = (props) => {
  const {
    show,
    onHide,
  } = props;
  return (
    <Modal
      show={show}
      onHide={() => onHide(false)}
    >
      <ModalContent {...props} />
    </Modal>
  );
};

export default OverrideSegmentModal;
