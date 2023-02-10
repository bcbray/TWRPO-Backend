import React from 'react';
import { VideoSegment, ServerBase } from '@twrpo/types';

import styles from './SegmentTitleTag.module.css';

import { useFactionCss } from './FactionStyleProvider';
import { classes } from './utils';
import Tag from './Tag';
import { useCurrentServer } from './CurrentServer';

interface UseSegmentTagTextOptions {
  ignoreLiveInfo?: boolean;
}

export const useSegmentTagText = (segment: VideoSegment, server: ServerBase, options: UseSegmentTagTextOptions = {}): string => {
  const { game } = useCurrentServer();
  const {
    ignoreLiveInfo = false,
  } = options;

  // TODO: Classes for other game, other server, etc
  let tagText: string;
  if (segment.server && segment.server.id === server.id) {
    if (!ignoreLiveInfo && segment.liveInfo) {
      tagText = segment.liveInfo.tagText;
    } else if (segment.character) {
      tagText = segment.character.displayInfo.displayName;
      if (segment.characterUncertain) {
        tagText = `? ${tagText} ?`;
      }
    } else {
      tagText = segment.server.name;
    }
  } else if (segment.game && segment.game.id === game.id && segment.server && segment.server.isRoleplay) {
    if (segment.server.isVisible) {
      tagText = `::${segment.server.name}::`;
    } else {
      tagText = '::Other Server::';
    }
  } else {
    // TODO: different game, has server
    tagText = `${segment.game?.name ?? 'Variety'}`;
  }
  return tagText;
}

interface SegmentTitleTagProps {
  className?: string;
  segment: VideoSegment;
}

const SegmentTitleTag: React.FC<SegmentTitleTagProps> = ({ className, segment }) => {
  const { server } = useCurrentServer();
  const { factionStylesForKey } = useFactionCss(server);
  const tagText = useSegmentTagText(segment, server);

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
      {tagText}
    </Tag>
  );
};

export default SegmentTitleTag;
