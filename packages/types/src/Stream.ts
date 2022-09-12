import FactionKey from './FactionKey';

export default interface Stream {
  channelName: string;
  title: string;
  viewers: number;
  profileUrl: string;
  id: number;
  streamId: string;
  rpServer: string | null;
  characterName: string | null;
  characterId: number | null;
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
