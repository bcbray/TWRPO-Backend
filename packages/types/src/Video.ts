import VideoSegment from "./VideoSegment";

export default interface Video {
    streamId: string;
    startDate: string;
    url: string;
    thumbnailUrl?: string;
    title: string;
    duration: string;
    segments: VideoSegment[];
}
