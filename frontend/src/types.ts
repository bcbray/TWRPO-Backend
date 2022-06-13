export interface FactionInfo {
  key: string;
  name: string;
  colorLight: string;
  colorDark: string;
};

export interface CharacterInfo {
  channelName: string;
  name: string;
  factions: FactionInfo[];
  nicknames: string[];
};


export interface CharactersResponse {
  factions: FactionInfo[];
  characters: CharacterInfo[];
};
