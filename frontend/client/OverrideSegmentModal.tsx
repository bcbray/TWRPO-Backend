import React from 'react';
import { Button } from '@restart/ui';
import { Streamer, VideoSegment, CharacterInfo, OverrideSegmentRequest } from '@twrpo/types';

import styles from './OverrideSegmentModal.module.css';

import { isFailure, isSuccess } from './LoadingState';
import Modal from './Modal';
import Spinner from './Spinner';
import { classes } from './utils';
import { useStreamer, useSegment } from './Data';
import { FancyDropdown, LineItem } from './FancyDropdown'
import DropdownItem from './DropdownItem';
import PastStreamCard from './PastStreamCard'
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

  const [overriddenCharacter, setOverriddenCharacter] = React.useState(segment.character);
  const [overriddenCharacterUncertain, setOverriddenCharacterUncertain] = React.useState(segment.characterUncertain);

  const characterUncertain = overriddenCharacter !== undefined && overriddenCharacterUncertain;

  const handleSubmit = React.useCallback(() => {
    setIsSubmitting(true);
    const request: OverrideSegmentRequest = {
      segmentId: segment.id,
      characterId: overriddenCharacter?.id ?? null,
      characterUncertain,
    }
    fetch('/api/v2/admin/override-segment', {
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
  }, [segment.id, overriddenCharacter?.id, characterUncertain, onHide]);

  const characterLineItems: CharacterLineItem[] = React.useMemo(() => [
    {
      id: 'meta-none',
      name: 'No character',
      element: <DropdownItem
        key={'meta-none'}
        onClick={(e) => e.preventDefault()}
        eventKey={'meta-none'}
        active={overriddenCharacter === undefined}
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
        active={character.id === overriddenCharacter?.id}
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
  ], [characters, factionStylesForKey, overriddenCharacter]);

  const editedSegment = React.useMemo(() => {
    const {
      character: oldCharacter,
      characterUncertain: oldCharacterUncertain,
      ...rest
    } = segment;
    return {
      ...rest,
      character: overriddenCharacter,
      characterUncertain,
    }
  }, [segment, overriddenCharacter, characterUncertain]);

  return <>
    <div className={styles.header}>
      Edit segment
    </div>
    <div className={styles.body}>
      <div>
        <PastStreamCard
          className={styles.card}
          streamer={streamer}
          segment={editedSegment}
          wrapTitle
          noEdit
          dimmed={false}
        />
      </div>
      <div>
        <FancyDropdown
          className={styles.characterDropdown}
          buttonClassName={styles.characterDropdownButton}
          title={overriddenCharacter?.displayInfo.realNames.join(' ') ?? 'No character'}
          items={characterLineItems}
          onSelect={item => setOverriddenCharacter(item?.character)}
        />
      </div>
      <div>
        <label
          className={classes(
            overriddenCharacter === undefined && styles.disabled
          )}
        >
          <input
            type='checkbox'
            checked={characterUncertain}
            disabled={overriddenCharacter === undefined}
            onChange={e => setOverriddenCharacterUncertain(e.target.checked)}
          />
          {' '}
          Uncertain
        </label>
      </div>
    </div>
    <div className={styles.footer}>
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
  show,
  onHide,
}) => {
  const [streamerLoadState] = useStreamer(streamerTwitchLogin);
  const [segmentLoadState] = useSegment(segmentId);
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
