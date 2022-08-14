import FactionInfo from './FactionInfo';
import CharacterInfo from './CharacterInfo';

export default interface CharactersResponse {
  factions: FactionInfo[];
  characters: CharacterInfo[];
}
