import Streamer from './Streamer';
import VideoSegment from './VideoSegment';

export default interface SegmentAndStreamer {
    streamer: Streamer;
    segment: VideoSegment;
}
