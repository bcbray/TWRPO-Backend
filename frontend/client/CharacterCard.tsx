import React from 'react';
import { Headphones, XLg, VolumeMuteFill } from 'react-bootstrap-icons';

import styles from './CharacterCard.module.css';
import OverlayTrigger from './OverlayTrigger';
import Tooltip from './Tooltip';
import { Stream, FactionInfo } from './types';
import { classes } from './utils';
import Tag from './Tag';

interface Props {
  stream: Stream;
  factionInfo?: FactionInfo;
  focused?: boolean;
  onClickFocus: () => void;
  onClickRemove: () => void;
  className?: string;
  children?: React.ReactNode;
};

const CharacterCard: React.FC<Props> = ({ stream, factionInfo, focused = false, onClickFocus, onClickRemove, className, children }) => {
    return (
      <div className={classes(
        styles.container,
        focused ? styles.focused : styles.muted,
        className
      )}>
        {children}
        <div className={styles.tags}>
          <Tag
            className={classes(styles.tag, styles.nametag)}
            style={{
              background: factionInfo?.colorDark,
            }}
          >
            <p>{stream.tagText}</p>
          </Tag>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="focus-tooltip" className={styles.tooltip} innerClassName={styles.inner} arrowClassName={styles.arrow}>
                {focused ? 'Mute audio' : 'Focus audio'}
              </Tooltip>
            }
          >
            <Tag className={classes(styles.tag, styles.iconTag, styles.focustag)} onClick={onClickFocus}>
              <div className={styles.whenFocused}>
                <Headphones size={16} style={{ verticalAlign: 'baseline' }} />
              </div>
              <div className={styles.whenMuted}>
                <VolumeMuteFill size={16} style={{ verticalAlign: 'baseline' }} />
              </div>
            </Tag>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="remove-tooltip" className={styles.tooltip} innerClassName={styles.inner} arrowClassName={styles.arrow}>
                Remove stream
              </Tooltip>
            }
          >
            <Tag className={classes(styles.tag, styles.iconTag, styles.removetag)} onClick={onClickRemove}>
              <XLg size={16} style={{ verticalAlign: 'baseline' }} />
            </Tag>
          </OverlayTrigger>
        </div>
      </div>
    );
}

export default CharacterCard;
