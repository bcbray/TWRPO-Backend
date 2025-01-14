import FactionKey from './FactionKey';

export default interface Stream {
  channelName: string;
  channelTwitchId: string;
  title: string;
  viewers: number;
  profileUrl: string;
  id: number;
  streamId: string;
  rpServer: string | null;
  serverId: number | null;
  characterName: string | null;
  characterUncertain: boolean | null;
  characterDisplayName: string | null;
  characterId: number | null;
  characterContact: string | null;
  nicknameLookup: string | null;
  faction: FactionKey;
  factions: FactionKey[];
  factionsMap: Record<FactionKey, boolean>;
  tagText: string;
  tagFaction: FactionKey;
  tagFactionSecondary?: FactionKey;
  videoUrl?: string;
  thumbnailUrl?: string;
  startDate: string;
  segmentId: number;
  isHidden: boolean;
}
