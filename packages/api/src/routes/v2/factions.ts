import { Router } from 'express';
import { ApiClient } from 'twitch';
import { DataSource } from 'typeorm';
import { FactionInfo, FactionsResponse } from '@twrpo/types';

import { wrpFactionsReal, FactionRealFull } from '../../data/meta';
import { useColorsLight, useColorsDark, filterRename } from '../../data/factions';
import { objectEntries } from '../../utils';
import { getWrpLive } from '../live/liveData';

export const fetchFactions = async (apiClient: ApiClient, dataSource: DataSource): Promise<FactionsResponse> => {
    const liveData = await getWrpLive(apiClient, dataSource);

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

    return {
        factions: factionInfos,
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchFactions(apiClient, dataSource);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
