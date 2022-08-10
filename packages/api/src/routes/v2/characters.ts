import { Router } from 'express';
import { ApiClient } from 'twitch';

import { wrpCharacters } from '../../data/characters';
import { getWrpLive, Stream } from '../live/liveData';
import { displayInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';
import { fetchFactions } from './factions';

interface FactionInfo {
    key: string;
    name: string;
    colorLight: string;
    colorDark: string;
    liveCount: number;
}

interface DisplayInfo {
    realNames: string[];
    nicknames: string[];
    titles: string[];
    displayName: string;
}

interface CharacterInfo {
    channelName: string;
    name: string;
    displayInfo: DisplayInfo;
    factions: FactionInfo[];
    liveInfo?: Stream;
    channelInfo?: ChannelInfo;
}

interface ChannelInfo {
    id: string;
    login: string;
    displayName: string;
    profilePictureUrl: string;
}

export interface CharactersResponse {
    factions: FactionInfo[];
    characters: CharacterInfo[];
}

export const fetchCharacters = async (apiClient: ApiClient): Promise<CharactersResponse> => {
    const knownUsers = await getKnownTwitchUsers(apiClient);

    const liveData = await getWrpLive(apiClient);

    const { factions: factionInfos } = await fetchFactions(apiClient);

    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));
    const { independent } = factionMap;

    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
        const channelInfo = knownUsers.find(u =>
            u.displayName.toLowerCase() === streamer.toLowerCase()
            || u.login.toLowerCase() == streamer.toLowerCase());
        return characters
            .filter(character => character.assume !== 'neverNp')
            .map((character) => {
                const stream = liveData.streams.find(s => s.channelName === streamer && s.characterName === character.name);
                return {
                    channelName: streamer,
                    name: character.name,
                    displayInfo: displayInfo(character),
                    factions: character.factions?.map((faction) => {
                        const factionMini = faction.toLowerCase().replaceAll(' ', '');
                        return factionMap[factionMini];
                    }) ?? [independent],
                    liveInfo: stream,
                    channelInfo,
                } as CharacterInfo;
            });
    });

    return {
        factions: factionInfos,
        characters: characterInfos,
    };
};

const buildRouter = (apiClient: ApiClient): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchCharacters(apiClient);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
