import React from 'react';
import { Button } from '@restart/ui';
import {
  Streamer,
  VideoSegment,
  CharacterInfo,
  OverrideSegmentRequest,
  Stream,
} from '@twrpo/types';

import styles from './OverrideSegmentModal.module.css';

import { isFailure, isSuccess, fetchAndCheck } from './LoadingState';
import Modal from './Modal';
import Spinner from './Spinner';
import { classes } from './utils';
import { useStreamer, useSegment } from './Data';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import VideoSegmentCard from './VideoSegmentCard'
import Tag from './Tag'
import { useFactionCss } from './FactionStyleProvider';

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
  onHide: (overridden: boolean) => void;
}

interface CharacterLineItem extends LineItem {
  character?: CharacterInfo;
}

const FormContent: React.FC<LoadedProps> = ({
    streamer,
    segment,
    characters,
    onHide,
}) => {
  const { factionStylesForKey } = useFactionCss();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const [overriddenCharacter, setOverriddenCharacter] = React.useState<CharacterInfo | null | undefined>(undefined);
  const [overriddenCharacterUncertain, setOverriddenCharacterUncertain] = React.useState<boolean | undefined>(undefined);
  const [overriddenIsHidden, setOverriddenIsHidden] = React.useState<boolean | undefined>(undefined);

  const handleSubmit = React.useCallback(() => {
    setIsSubmitting(true);
    setHasError(false);
    const request: OverrideSegmentRequest = {
      segmentId: segment.id,
      characterId: overriddenCharacter !== undefined
        ? overriddenCharacter?.id ?? null
        : undefined,
      characterUncertain: overriddenCharacterUncertain,
      isHidden: overriddenIsHidden,
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
  }, [segment.id, overriddenCharacter, overriddenCharacterUncertain, overriddenIsHidden, onHide]);

  const displayedSelectedCharacter = overriddenCharacter === undefined
    ? segment.character
    : overriddenCharacter;
  const canBeUncertain = displayedSelectedCharacter !== null;
  const displayedCharacterUncertain = !canBeUncertain
    ? false
    : overriddenCharacterUncertain === undefined
      ? segment.characterUncertain
      : overriddenCharacterUncertain;

  const displayedIsHidden = overriddenIsHidden === undefined
        ? segment.isHidden ?? false
        : overriddenIsHidden;

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

  const editedSegment: VideoSegment = React.useMemo(() => {
    const {
      character: oldCharacter,
      characterUncertain: oldCharacterUncertain,
      liveInfo: oldLiveInfo,
      ...rest
    } = segment;
    let liveInfo: Stream | undefined;
    if (oldLiveInfo) {
      const {
        tagText: oldTagText,
        tagFaction: oldTagFaction,
        ...rest
      } = oldLiveInfo;
      const tagText = displayedSelectedCharacter
        ? displayedCharacterUncertain
          ? `? ${displayedSelectedCharacter.displayInfo.displayName} ?`
          : displayedSelectedCharacter.displayInfo.displayName
        : 'WRP';
      liveInfo = {
        tagText,
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
      liveInfo,
    }
  }, [segment, displayedSelectedCharacter, displayedCharacterUncertain]);

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
          canDim={false}
          handleRefresh={() => {}}
        />
      </div>
      <div>
        <FancyDropdown
          className={styles.characterDropdown}
          buttonClassName={styles.characterDropdownButton}
          title={displayedSelectedCharacter?.displayInfo.realNames.join(' ') ?? 'No character'}
          items={characterLineItems}
          onSelect={item => setOverriddenCharacter(item?.character)}
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
          Uncertain
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
  if (isSuccess(streamerLoadState) && isSuccess(segmentLoadState)) {
    return <FormContent
      streamer={streamerLoadState.data.streamer}
      segment={segmentLoadState.data}
      characters={streamerLoadState.data.characters}
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
