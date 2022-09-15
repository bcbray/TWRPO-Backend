import Stream from './Stream';
import CharacterInfo from './CharacterInfo';

export default interface VideoSegment {
    id: number;
    title: string;
    url?: string;
    thumbnailUrl?: string;
    startDate: string;
    endDate: string;
    character?: CharacterInfo;
    characterUncertain: boolean;
    streamId: string;
    isHidden?: boolean;
    liveInfo?: Stream;
}
