import FactionKey from './FactionKey';
import Stream from './Stream';
import CharacterInfo from './CharacterInfo';

export default interface LiveResponse {
    minViewers: number;
    stopOnMin: boolean;
    intervalSeconds: number;
    useColorsDark: Record<FactionKey, string>;
    useColorsLight: Record<FactionKey, string>;
    wrpFactions: Record<FactionKey, string>;
    factionCount: Record<FactionKey, number>;
    filterFactions: [FactionKey, string, boolean][];
    streams: Stream[];
    tick: number;
    recentOfflineCharacters?: CharacterInfo[];
}
