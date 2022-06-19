export interface FactionInfo {
  key: string;
  name: string;
  colorLight: string;
  colorDark: string;
  liveCount: number;
};

export interface CharacterInfo {
  channelName: string;
  name: string;
  factions: FactionInfo[];
  nicknames: string[];
  liveInfo?: { viewers: number };
}


export interface CharactersResponse {
  factions: FactionInfo[];
  characters: CharacterInfo[];
};
