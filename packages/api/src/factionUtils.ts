import { FactionInfo } from '@twrpo/types';

import { wrpFactionsReal, FactionRealFull } from './data/meta';
import { useColorsLight, useColorsDark, filterRename } from './data/factions';
import { objectEntries } from './utils';

type FactionKey = keyof typeof filterRename;

export const getFactionInfos = (liveCounts: Record<FactionKey, number>): FactionInfo[] => {
    const ignoredFactions: FactionRealFull[] = ['Development', 'Other', 'Other Faction', 'Podcast', 'Watch Party'];
    return objectEntries(wrpFactionsReal).filter(([__, faction]) => !ignoredFactions.includes(faction)).map(([mini, faction]) => {
        const colorLightKey = mini as keyof typeof useColorsLight;
        const colorDarkKey = mini as keyof typeof useColorsDark;
        const factionRenameKey = mini as keyof typeof filterRename;

        const factionInfo: FactionInfo = {
            key: mini,
            name: filterRename[factionRenameKey] ?? faction,
            colorLight: useColorsLight[colorLightKey] ?? '#12af7e',
            colorDark: useColorsDark[colorDarkKey] ?? '#32ff7e',
            liveCount: liveCounts[factionRenameKey],
        };
        return factionInfo;
    });
};
