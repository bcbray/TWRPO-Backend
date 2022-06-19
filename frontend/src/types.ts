export interface FactionInfo {
  key: string;
  name: string;
  colorLight: string;
  colorDark: string;
  liveCount: number;
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
