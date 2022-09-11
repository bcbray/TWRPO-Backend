import React from 'react';
import OverlayTrigger from './OverlayTrigger';
import { Stream } from '@twrpo/types';

import styles from './LiveBadge.module.css'

import StreamCard from './StreamCard';
import Tag from './Tag';
import { classes } from './utils';

interface LiveBadgeProps {
  stream: Stream;
  className?: string;
}

const LiveBadge: React.FC<LiveBadgeProps> = ({ stream, className }) => (
  <OverlayTrigger
    placement='bottom-start'
    delay={{ show: 250, hide: 100 }}
    overlay={({ placement, arrowProps, show: _show, popper, ...props }) => (
      <div className={styles.streamPopover} {...props}>
        <StreamCard
          id='live-preview-tooltop'
          style={{
            width: 300,
          }}
          stream={stream}
          cardStyle='card'
          embed
        />
      </div>
    )}
  >
    <Tag as='span' className={classes(className, styles.liveTag)}>Live</Tag>
  </OverlayTrigger>
);

export default LiveBadge;
