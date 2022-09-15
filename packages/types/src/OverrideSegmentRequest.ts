export default interface OverrideSegmentRequest {
    segmentId: number;
    characterId?: number | null;
    characterUncertain?: boolean;
    isHidden?: boolean;
}
