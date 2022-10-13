export default interface OverrideSegmentRequest {
    segmentId: number;
    characterId?: number | null;
    characterUncertain?: boolean;
    serverId?: number | null;
    isHidden?: boolean;
}
