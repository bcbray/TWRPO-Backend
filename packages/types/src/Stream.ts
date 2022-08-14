import FactionKey from './FactionKey';

export default interface Stream {
  channelName: string;
  title: string;
  viewers: number;
  profileUrl: string;
  id: number;
  rpServer: string | null;
  characterName: string | null;
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
}
