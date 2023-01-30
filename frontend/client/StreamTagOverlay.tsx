import React from 'react';
import { useHoverDirty } from 'react-use';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { FactionInfo, Stream, CharacterInfo, VideoSegment } from '@twrpo/types';

import styles from './StreamTagOverlay.module.css';

import TagComponent, { TagProps } from './Tag';
import { classes, style } from './utils';
import { useFactionCss } from './FactionStyleProvider';
import { useDelayed } from './hooks';
import { useSegmentTagText } from './SegmentTitleTag';

export interface BaseTag {
  /** A key used to differentiate a tag amongst its siblings */
  key: string;

  /** An optional action to be performed when this tag is clicked */
  onClick?: () => void;

  /** An optional title shown when mousing over the tag */
  title?: string;

  /** An optional icon shown to the left of the tag text */
  icon?: React.ReactNode;
}

/** A tag colored for the faction with the given text */
export interface FactionStyledTag extends BaseTag {
  type: 'faction-styled';
  text: string;
  factionKey: string;
}

/** A plain white tag with the given text  */
export interface PlainTag extends BaseTag {
  type: 'plain';
  text: string;
}

/** A pill with the name of the given faction and colored for the faction. */
export interface FactionPill extends BaseTag {
  type: 'faction-pill';
  faction: FactionInfo;
}

/** A bright red tag with the text “LIVE” */
export interface LiveTag extends BaseTag {
  type: 'live';
}

/** A dark colored with the given text */
export interface SecondaryTag extends BaseTag {
  type: 'secondary';
  /**
    A sub-type for the tag.
    - **error**: red tag background
  */
  subtype?: 'error';
  key: string;
  text: string;
}

export type Tag = FactionStyledTag | PlainTag | FactionPill | LiveTag | SecondaryTag;

export const usePrimaryTagsForStream = (stream: Stream, factions: FactionInfo[], onSelectFaction?: (faction: FactionInfo) => void): Tag[] => {
  return React.useMemo(() => {
    let tags: Tag[] = [
      {
        type: 'faction-styled',
        key: 'tag',
        text: stream.tagText,
        factionKey: stream.tagFaction,
      },
    ];
    if (stream.characterDisplayName) {
      tags.push({
        type: 'plain',
        key: 'real-name',
        text: stream.characterDisplayName,
      });
    }
    tags = tags.concat(factions.map(f => ({
      type: 'faction-pill',
      key: f.key,
      faction: f,
      onClick: onSelectFaction ? () => onSelectFaction(f) : undefined,
    })));
    return tags;
  }, [stream, factions, onSelectFaction]);
};

export const usePrimaryTagsForCharacter = (character: CharacterInfo, onSelectFaction?: (faction: FactionInfo) => void): Tag[] => {
    return React.useMemo(() => [
      {
        type: 'faction-styled',
        key: 'tag',
        text: character.displayInfo.displayName,
        factionKey: character.factions.at(0)?.key ?? 'independent',
      },
      {
        type: 'plain',
        key: 'real-name',
        text: character.displayInfo.realNames.join(' '),
      },
      ...character.factions.map(f => ({
        type: 'faction-pill',
        key: f.key,
        faction: f,
        onClick: onSelectFaction ? () => onSelectFaction(f) : undefined,
      } as Tag))
    ], [character, onSelectFaction]);
};


export const usePrimaryTagsForSegment = (segment: VideoSegment, onSelectFaction?: (faction: FactionInfo) => void): Tag[] => {
  const text = useSegmentTagText(segment);
  return React.useMemo(() => {
    let tags: Tag[] = [
      {
        type: 'faction-styled',
        key: 'tag',
        text,
        factionKey: segment.liveInfo?.tagFaction
          ?? segment.character?.factions.at(0)?.key
          ?? 'otherwrp',
      },
    ];
    if (segment.character) {
      tags.push({
        type: 'plain',
        key: 'real-name',
        text: segment.character.displayInfo.realNames.join(' '),
      });
    }
    tags = tags.concat(segment.character?.factions.map(f => ({
      type: 'faction-pill',
      key: f.key,
      faction: f,
      onClick: onSelectFaction ? () => onSelectFaction(f) : undefined,
    })) ?? []);
    return tags;
  }, [text, segment, onSelectFaction]);
}

const SingleTag = <T extends React.ElementType = 'div'>(
  {
    tag,
    className: propsClassName,
    // style: propsStyle,
    ...props
  }: { tag: Tag } & TagProps<T>
) => {
  const { factionStyles, factionStylesForKey } = useFactionCss();

  const {
    onClick,
    title,
    icon,
  } = tag;

  let className: string | undefined;
  let text: string;

  switch (tag.type) {
    case 'faction-styled':
      className = styles.factionStyled;
      text = tag.text;
      break;
    case 'plain':
      className = styles.plain;
      text = tag.text;
      break;
    case 'faction-pill':
      className = styles.factionPill;
      text = tag.faction.name;
      break;
    case 'live':
      className = styles.live;
      text = 'Live';
      break;
    case 'secondary':
      className = classes(
        styles.secondary,
        tag.subtype === 'error' && styles.error,
      );
      text = tag.text;
      break;
  }

  return (
    <TagComponent
      className={classes(
        propsClassName,
        className,
        styles.tag,
        onClick && styles.clickable,
      )}
      onClick={onClick}
      style={style(
        props.style,
        tag.type === 'faction-styled' && factionStylesForKey(tag.factionKey),
        tag.type === 'faction-pill' && factionStyles(tag.faction),
      )}
      title={title}
      {...props}
    >
      <p>
        {icon && <span className={styles.icon}>{icon}</span>}
        {text}
      </p>
    </TagComponent>
  );
}

interface StreamTagOverlayProps {
  className?: string;
  topLeft?: Tag[];
  topRight?: Tag[];
  bottomLeft?: Tag[];
  bottomRight?: Tag[];
}

interface OverlaySectionProps {
  className?: string;
  tags: Tag[];
}

const OverlaySection: React.FC<OverlaySectionProps> = ({
  className,
  tags,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const instantHovered = useHoverDirty(ref);
  const delayedHovered = useDelayed(instantHovered, 250);

  return (
    <div
      ref={ref}
      className={classes(
        className,
      )}
    >
      <Flipper
        flipKey={delayedHovered ? 'collapsed' : 'hovered'}
        className={classes(
          styles.section,
          delayedHovered && styles.hovered
        )}
      >
        {tags.map(tag =>
          <Flipped flipId={tag.key} key={tag.key}>
            <SingleTag tag={tag} />
          </Flipped>
        )}
      </Flipper>
    </div>
  );
}

const StreamTagOverlay: React.FC<StreamTagOverlayProps> = ({
  className,
  topLeft = [],
  topRight = [],
  bottomLeft = [],
  bottomRight = [],
}) => {
  return (
    <div className={classes(styles.container, className)}>
      {(topLeft.length > 0 || topRight.length > 0) &&
        <div className={styles.top}>
          {topLeft.length > 0 && <OverlaySection className={styles.left} tags={topLeft} />}
          {topRight.length > 0 && <OverlaySection className={styles.right} tags={topRight} />}
        </div>
      }
      {(bottomLeft.length > 0 || bottomRight.length > 0) &&
        <div className={styles.bottom}>
          {bottomLeft.length > 0 && <OverlaySection className={styles.left} tags={bottomLeft} />}
          {bottomRight.length > 0 && <OverlaySection className={styles.right} tags={bottomRight} />}
        </div>
      }
    </div>
  );
};

export default StreamTagOverlay;
