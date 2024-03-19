import Streamer from './Streamer';
import CharacterInfo from './CharacterInfo';
import VideoSegment from './VideoSegment';

export default interface StreamerResponse {
    streamer: Streamer;
    characters: CharacterInfo[];
    requestedRemoval?: boolean;
    recentSegments: VideoSegment[];
}
