import { CharacterInfo, FactionInfo } from '@twrpo/types';

import type { Character } from './data/characters';
import type { FactionMini, FactionFull, FactionRealMini, FactionRealFull } from './data/meta';
import type { TwitchUser } from './pfps';

// TODO: Share this code between /api/v2/characters and liveData

interface DisplayInfo {
    realNames: string[];
    nicknames: string[];
    titles: string[];
    displayName: string;
}

const toFactionMini = (faction: string) => faction.toLowerCase().replaceAll(' ', '');
const fullFactionMap: { [key in FactionMini]?: FactionFull } = {}; // Factions with corresponding characters
const displayNameDefault: { [key in FactionMini]?: number } = {
    law: 2,
} as const;

export const displayInfo = (character: Character): DisplayInfo => {
    const names = character.name.split(/\s+/);
    const titles: string[] = [];
    const realNames: string[] = [];
    const nicknames = [...(character.nicknames?.filter(nck => !nck.startsWith('/')) ?? [])];
    let knownName;
    let currentName = null;
    let displayNameNum = character.displayName;

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        let pushName;
        if (currentName != null) {
            currentName.push(name);
            if (name.includes(']') || name.includes('"')) {
                pushName = currentName.join(' ');
                const type1 = pushName.includes('[');
                pushName = pushName.replace(/[\[\]"]/g, '');
                if (type1) {
                    titles.push(pushName); // had square
                } else {
                    knownName = pushName; // had quotes
                    nicknames.unshift(knownName);
                }
                currentName = null;
            }
        } else if (name.includes('[') || name.includes('"')) {
            const type1 = name.includes('[');
            if ((type1 && name.includes(']')) || (!type1 && name.indexOf('"') !== name.lastIndexOf('"'))) {
                pushName = name.replace(/[\[\]"]/g, '');
                if (type1) {
                    titles.push(pushName);
                } else {
                    knownName = pushName;
                    nicknames.unshift(knownName);
                }
            } else {
                currentName = [name];
            }
        } else {
            pushName = name.replace(/"/g, '');
            if (pushName !== name) {
                knownName = pushName; // had quotes
                nicknames.unshift(knownName);
            }
            realNames.push(pushName);
        }
    }

    const fullFactions: FactionRealFull[] = character.factions?.length ? character.factions : ['Independent'];
    const factions = fullFactions.map((fullFaction) => {
        const miniFaction = toFactionMini(fullFaction) as FactionRealMini;
        if (!fullFactionMap[miniFaction]) fullFactionMap[miniFaction] = fullFaction;
        return miniFaction;
    });

    const primaryFaction = factions[0];
    if (displayNameNum === undefined) displayNameNum = displayNameDefault[primaryFaction] ?? 1;

    const displayNameTitle = titles.length ? `《${titles.join(' ')}》` : '';
    let displayNameChar = '';
    if (knownName !== undefined) {
        displayNameChar = knownName;
    } else if (displayNameNum === 0) {
        displayNameChar = realNames.join(' ');
    } else {
        const displayNameCandidates = [...realNames];
        if (realNames.length === 1) displayNameCandidates.push(realNames[0]);
        displayNameCandidates.push(...nicknames);
        displayNameChar = displayNameCandidates[displayNameNum - 1]
            || displayNameCandidates[0];
    }
    const displayName = `${character.leader ? `♛${displayNameTitle ? '' : ' '}` : ''}${displayNameTitle}${displayNameChar}`.trim();

    return {
        realNames,
        nicknames,
        titles,
        displayName,
    };
};

export const getCharacterInfo = (
    channelName: string,
    character: Character,
    twitchUser: TwitchUser | undefined,
    factions: FactionInfo[] | Record<string, FactionInfo>
): CharacterInfo => {
    const factionMap = Array.isArray(factions)
        ? Object.fromEntries(factions.map(f => [f.key, f]))
        : factions;
    const { independent } = factionMap;
    return {
        id: character.id,
        channelName,
        name: character.name,
        displayInfo: displayInfo(character),
        factions: character.factions?.map((faction) => {
            const factionMini = faction.toLowerCase().replaceAll(' ', '');
            return factionMap[factionMini];
        }) ?? [independent],
        formerFactions: character.formerFactions?.map((faction) => {
            const factionMini = faction.toLowerCase().replaceAll(' ', '');
            return factionMap[factionMini];
        }) ?? [],
        contact: character.telegram,
        isDeceased: character.deceased ? true : undefined,
        channelInfo: twitchUser,
    };
};
