export interface FactionInfo {
  key: string;
  name: string;
  colorLight: string;
  colorDark: string;
  liveCount?: number;
  isLive?: boolean;
};

export interface DisplayInfo {
  realNames: string[];
  nicknames: string[];
  titles: string[];
  displayName: string;
}

export interface CharacterInfo {
  channelName: string;
  name: string;
  displayInfo: DisplayInfo;
  factions: FactionInfo[];
  liveInfo?: { viewers: number };
}


export interface CharactersResponse {
  factions: FactionInfo[];
  characters: CharacterInfo[];
};

export type FactionKey = string;

export interface Stream {
  channelName: string;
  title: string;
  viewers: number;
  profileUrl: string;
  id: number;
  rpServer: string | null;
  characterName: string | null;
  nicknameLookup: string | null;
  faction: FactionKey;
  factions: [FactionKey];
  factionsMap: Record<FactionKey, boolean>;
  tagText: string;
  tagFaction: FactionKey;
  tagFactionSecondary?: FactionKey;
  videoUrl?: string;
  thumbnailUrl?: string;
  startDate?: Date;
}

export interface LiveResponse {
    minViewers: number;
    stopOnMin: boolean;
    intervalSeconds: number;
    useColorsDark: Record<FactionKey, string>;
    useColorsLight: Record<FactionKey, string>;
    wrpFactions: Record<FactionKey, string>;
    factionCount: Record<FactionKey, number>;
    filterFactions: [FactionKey, string, boolean][];
    streams: Stream[];
    tick: number;
}
