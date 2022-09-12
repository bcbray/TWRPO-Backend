import SegmentAndStreamer from './SegmentAndStreamer';

export default interface StreamerResponse {
    unknown: SegmentAndStreamer[];
    uncertain: SegmentAndStreamer[];
}
