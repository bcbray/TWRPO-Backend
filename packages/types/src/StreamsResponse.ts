import SegmentAndStreamer from './SegmentAndStreamer';

export default interface StreamsResponse {
    streams: SegmentAndStreamer[];
    lastRefreshTime: string;
    nextCursor?: string;
}
