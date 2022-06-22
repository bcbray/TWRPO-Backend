import { Router } from 'express';

import { wrpCharacters } from '../../data/characters';
import { wrpFactionsReal, FactionRealFull } from '../../data/meta';
import { useColorsLight, useColorsDark, filterRename } from '../../data/factions';
import { objectEntries } from '../../utils';
import { getWrpLive, Stream } from '../live/liveData';
import { displayInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';

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

interface CharactersResponse {
    factions: FactionInfo[];
    characters: CharacterInfo[];
}

const router = Router();

router.get('/', async (_, res) => {
    const knownUsers = await getKnownTwitchUsers();

    const liveData = await getWrpLive();

    const ignoredFactions: FactionRealFull[] = ['Development', 'Other', 'Other Faction', 'Podcast', 'Watch Party'];
    const factionInfos = objectEntries(wrpFactionsReal).filter(([__, faction]) => !ignoredFactions.includes(faction)).map(([mini, faction]) => {
        const colorLightKey = mini as keyof typeof useColorsLight;
        const colorDarkKey = mini as keyof typeof useColorsDark;
        const factionRenameKey = mini as keyof typeof filterRename;

        const factionInfo: FactionInfo = {
            key: mini,
            name: filterRename[factionRenameKey] ?? faction,
            colorLight: useColorsLight[colorLightKey] ?? '#12af7e',
            colorDark: useColorsDark[colorDarkKey] ?? '#32ff7e',
            liveCount: liveData.factionCount[factionRenameKey],
        };
        return factionInfo;
    });

    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));
    const { independent } = factionMap;

    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
        const channelInfo = knownUsers.find(u =>
            u.displayName.toLowerCase() === streamer.toLowerCase()
            || u.login.toLowerCase() == streamer.toLowerCase());
        return characters.map((character) => {
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

    const response: CharactersResponse = {
        factions: factionInfos,
        characters: characterInfos,
    };
    return res.send(response);
});

export default router;
