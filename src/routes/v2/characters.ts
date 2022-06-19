import { Router } from 'express';

import { wrpCharacters } from '../../data/characters';
import { wrpFactionsReal, FactionRealFull } from '../../data/meta';
import { useColorsLight, useColorsDark, filterRename } from '../../data/factions';
import { objectEntries } from '../../utils';
import { getWrpLive } from '../live/liveData';
import { displayInfo } from '../../characterUtils';

interface FactionInfo {
    key: string;
    name: string;
    colorLight?: string;
    colorDark?: string;
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
    liveInfo?: { viewers: number };
}

interface CharactersResponse {
    factions: FactionInfo[];
    characters: CharacterInfo[];
}

const router = Router();

router.get('/', async (_, res) => {
    const liveData = await getWrpLive();

    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) =>
        characters.map((character) => {
            const stream = liveData.streams.find(s => s.channelName === streamer && s.characterName === character.name);
            return {
                channelName: streamer,
                name: character.name,
                displayInfo: displayInfo(character),
                factions: character.factions?.map((faction) => {
                    const factionMini = faction.toLowerCase().replaceAll(' ', '');
                    const colorLightKey = factionMini as keyof typeof useColorsLight;
                    const colorDarkKey = factionMini as keyof typeof useColorsDark;
                    const factionRenameKey = factionMini as keyof typeof filterRename;

                    const factionInfo: FactionInfo = {
                        key: factionMini,
                        name: filterRename[factionRenameKey] ?? faction,
                        colorLight: useColorsLight[colorLightKey],
                        colorDark: useColorsDark[colorDarkKey],
                        liveCount: liveData.factionCount[factionRenameKey],
                    };
                    return factionInfo;
                }) ?? [],
                liveInfo: stream && { viewers: stream.viewers },
            } as CharacterInfo;
        }));
    const ignoredFactions: FactionRealFull[] = ['Development', 'Independent', 'Other', 'Other Faction', 'Podcast', 'Watch Party'];
    const factionInfos = objectEntries(wrpFactionsReal).filter(([__, faction]) => !ignoredFactions.includes(faction)).map(([mini, faction]) => {
        const colorLightKey = mini as keyof typeof useColorsLight;
        const colorDarkKey = mini as keyof typeof useColorsDark;
        const factionRenameKey = mini as keyof typeof filterRename;

        const factionInfo: FactionInfo = {
            key: mini,
            name: filterRename[factionRenameKey] ?? faction,
            colorLight: useColorsLight[colorLightKey],
            colorDark: useColorsDark[colorDarkKey],
            liveCount: liveData.factionCount[factionRenameKey],
        };
        return factionInfo;
    });

    const response: CharactersResponse = {
        factions: factionInfos,
        characters: characterInfos,
    };
    return res.send(response);
});

export default router;
