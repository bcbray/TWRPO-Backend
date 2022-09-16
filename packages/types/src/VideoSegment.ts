import Stream from './Stream';
import CharacterInfo from './CharacterInfo';

export default interface VideoSegment {
    id: number;
    title: string;
    url?: string;
    thumbnailUrl?: string;
    startDate: string;
    endDate: string;
    character: CharacterInfo | null;
    characterUncertain: boolean;
    streamId: string;
    isHidden: boolean;
    isTooShort: boolean;
    liveInfo?: Stream;
}
