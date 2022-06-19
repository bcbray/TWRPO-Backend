import React from 'react';
import styles from './CharacterCard.module.css';
import { CharacterInfo } from './types';
import { OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Headphones, XLg, VolumeMuteFill } from 'react-bootstrap-icons';

interface Props {
  character: CharacterInfo;
  focused?: boolean;
  onClickFocus: () => void;
  onClickRemove: () => void;
  children?: React.ReactNode;
};

const CharacterCard: React.FC<Props> = ({ character, focused = false, onClickFocus, onClickRemove, children }) => {
    return (
      <div className={[styles.container, focused ? styles.focused : styles.muted].join(' ')}>
        {children}
        <div className={styles.tags}>
          <div
            className={`${styles.tag} ${styles.nametag}`}
            style={{
              background: (character.factions.length > 0 && character.factions[0].colorDark) || '#32ff7e',
            }}
          >
            <p>{character.displayInfo.displayName}</p>
          </div>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="focus-tooltip" className={styles.tooltip}>
                {focused ? 'Mute audio' : 'Focus audio'}
              </Tooltip>
            }
          >
            <div className={[styles.tag, styles.iconTag, styles.focustag].join(' ')} onClick={onClickFocus}>
              <div className={styles.whenFocused}>
                <Headphones size={16} style={{ verticalAlign: 'baseline' }} />
              </div>
              <div className={styles.whenMuted}>
                <VolumeMuteFill size={16} style={{ verticalAlign: 'baseline' }} />
              </div>
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="remove-tooltip" className={styles.tooltip}>
                Remove stream
              </Tooltip>
            }
          >
            <div className={[styles.tag, styles.iconTag, styles.removetag].join(' ')} onClick={onClickRemove}>
              <XLg size={16} style={{ verticalAlign: 'baseline' }} />
            </div>
          </OverlayTrigger>
        </div>
      </div>
    );
}

export default CharacterCard;
