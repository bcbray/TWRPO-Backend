import { VideoSegment } from '@twrpo/types';

import { StreamChunk } from './db/entity/StreamChunk';

export const minimumSegmentLengthMinutes = 10;
export const minimumSegmentLengthMilliseconds = minimumSegmentLengthMinutes * 60 * 1000;

export const segmentIsShorterThanMinimum = (segment: VideoSegment): boolean => {
    const start = new Date(segment.startDate);
    const end = new Date(segment.endDate);
    return end.getTime() - start.getTime() < minimumSegmentLengthMilliseconds;
};

export const chunkIsShorterThanMinimum = (chunk: StreamChunk): boolean =>
    chunk.lastSeenDate.getTime() - chunk.firstSeenDate.getTime() < minimumSegmentLengthMilliseconds;

export const segmentIsRecent = (segment: VideoSegment): boolean => {
        const now = new Date();
        const end = new Date(segment.endDate);
        return now.getTime() - end.getTime() < minimumSegmentLengthMilliseconds / 2;
    };

export const chunkIsRecent = (chunk: StreamChunk): boolean =>
    (new Date()).getTime() - chunk.lastSeenDate.getTime() < minimumSegmentLengthMilliseconds / 2;
