import Stream from './Stream';
import CharacterInfo from './CharacterInfo';
import ServerBase from './ServerBase';
import Game from './Game';

export default interface VideoSegment {
    id: number;
    title: string;
    url?: string;
    thumbnailUrl?: string;
    startDate: string;
    endDate: string;
    streamStartDate: string;
    character: CharacterInfo | null;
    characterUncertain: boolean;
    streamId: string;
    isHidden: boolean;
    isTooShort: boolean;
    liveInfo?: Stream;
    server?: ServerBase;
    serverUncertain: boolean;
    game?: Game;
}
