import React from 'react';
import { VideoSegment } from '@twrpo/types';

import styles from './SegmentTitleTag.module.css';

import { useFactionCss } from './FactionStyleProvider';
import { classes } from './utils';
import Tag from './Tag';

interface SegmentTitleTagProps {
  className?: string;
  segment: VideoSegment;
}

const SegmentTitleTag: React.FC<SegmentTitleTagProps> = ({ className, segment }) => {
  const { factionStylesForKey } = useFactionCss();

  return (
    <Tag
      className={classes(className, styles.tag)}
      style={{
        ...factionStylesForKey(
          segment.liveInfo?.tagFaction
          ?? segment.character?.factions[0]?.key
          ?? 'otherwrp'
        ),
      }}
    >
      {segment.liveInfo ? (
        segment.liveInfo.tagText
      ) : segment.character ? (
        <>
          {segment.characterUncertain && '? '}
          {segment.character.displayInfo.displayName}
          {segment.characterUncertain && ' ?'}
        </>
      ) : (
        'WRP'
      )}
    </Tag>
  );
};

export default SegmentTitleTag;
