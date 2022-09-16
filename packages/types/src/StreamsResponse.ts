import SegmentAndStreamer from './SegmentAndStreamer';

export default interface StreamerResponse {
    streams: SegmentAndStreamer[];
    nextCursor?: string;
}
