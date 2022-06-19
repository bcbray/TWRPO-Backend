import React from 'react';
import { CharacterInfo } from './types';

interface Props {
  character: CharacterInfo
  children?: React.ReactNode
};

const CharacterCard: React.FC<Props> = ({ character, children }) => {
    return (
      <div
        className="character-card"
        style={{
          position: 'relative',
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {children}
        <div
          className="px-2 text-truncate"
          style={{
            position: 'absolute',
            borderRadius: '4px',
            background: (character.factions.length > 0 && character.factions[0].colorDark) || '#32ff7e',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            margin: '20px',
            right: '0',
          }}
        >
          <p
            className="small m-0"
            style={{
              fontWeight: '500',
            }}
          >
            {character.name}
          </p>
        </div>
      </div>
    );
}

export default CharacterCard;
