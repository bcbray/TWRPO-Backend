import { Router } from 'express';

import { wrpCharacters } from '../../data/characters';
import { wrpFactionsReal, FactionRealFull } from '../../data/meta';
import { useColorsLight, useColorsDark, filterRename } from '../../data/factions';
import { objectEntries } from '../../utils';

interface FactionInfo {
    key: string;
    name: string;
    colorLight?: string;
    colorDark?: string;
};

interface CharacterInfo {
    channelName: string;
    name: string;
    factions: FactionInfo[];
    nicknames: string[];
};

interface CharactersResponse {
    factions: FactionInfo[];
    characters: CharacterInfo[];
};

const router = Router();

router.get('/', (_, res) => {
    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
        return characters.map(character => {
            const characterInfo: CharacterInfo = {
                channelName: streamer,
                name: character.name,
                factions: character.factions?.map(faction => {
                    const factionMini = faction.toLowerCase().replaceAll(' ', '');
                    const colorLightKey = factionMini as keyof typeof useColorsLight;
                    const colorDarkKey = factionMini as keyof typeof useColorsDark;
                    const factionRenameKey = factionMini as keyof typeof filterRename;

                    const factionInfo: FactionInfo = {
                        key: factionMini,
                        name: filterRename[factionRenameKey] ?? faction,
                        colorLight: useColorsLight[colorLightKey],
                        colorDark:  useColorsDark[colorDarkKey]
                    }
                    return factionInfo;
                }) ?? [],
                nicknames: character.nicknames?.filter(n => !n.startsWith('/')) ?? [],
            }
            return characterInfo;
        });
    });
    const ignoredFactions: FactionRealFull[] = ['Development', 'Independent', 'Other', 'Other Faction', 'Podcast', 'Watch Party']
    const factionInfos = objectEntries(wrpFactionsReal).filter(([_, faction]) => {
        return !ignoredFactions.includes(faction);
    }).map(([mini, faction]) => {
        const colorLightKey = mini as keyof typeof useColorsLight;
        const colorDarkKey = mini as keyof typeof useColorsDark;
        const factionRenameKey = mini as keyof typeof filterRename;

        const factionInfo: FactionInfo = {
            key: mini,
            name: filterRename[factionRenameKey] ?? faction,
            colorLight: useColorsLight[colorLightKey],
            colorDark:  useColorsDark[colorDarkKey]
        }
        return factionInfo;
    });

    const response: CharactersResponse  = {
        factions: factionInfos,
        characters: characterInfos
    }
    return res.send(response);
});

export default router;
