import { Router } from 'express';
import { ApiClient } from 'twitch';
import { DataSource } from 'typeorm';
import { CharacterInfo, CharactersResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getWrpLive } from '../live/liveData';
import { displayInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';
import { fetchFactions } from './factions';
import { StreamChunk } from '../../db/entity/StreamChunk';

export interface CharactersRequest {
    limit?: number;
    page?: number;
}

export const fetchCharacters = async (apiClient: ApiClient, dataSource: DataSource): Promise<CharactersResponse> => {
    const knownUsers = await getKnownTwitchUsers(apiClient);

    const liveData = await getWrpLive(apiClient, dataSource);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource);

    const streamChunks = await dataSource
        .getRepository(StreamChunk)
        .createQueryBuilder('chunk')
        .distinctOn(['chunk.streamerId', 'chunk.characterId'])
        .orderBy('chunk.streamerId', 'ASC')
        .addOrderBy('chunk.characterId', 'ASC')
        .addOrderBy('chunk.lastSeenDate', 'DESC')
        .getMany();

    const seen: Record<string, Record<number, StreamChunk>> = {};
    streamChunks.forEach((streamChunk) => {
        if (!streamChunk.characterId) {
            return;
        }
        if (streamChunk.characterUncertain) {
            return;
        }
        if (!seen[streamChunk.streamerId]) {
            seen[streamChunk.streamerId] = {};
        }
        seen[streamChunk.streamerId][streamChunk.characterId] = streamChunk;
    });

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
                let lastSeenLive: Date | undefined;
                if (channelInfo?.id
                    && seen[channelInfo?.id]
                    && seen[channelInfo?.id][character.id]
                    && seen[channelInfo?.id][character.id].lastSeenDate.getTime() - seen[channelInfo?.id][character.id].firstSeenDate.getTime() > 1000 * 60 * 10
                ) {
                    lastSeenLive = seen[channelInfo?.id][character.id].lastSeenDate;
                } else {
                    lastSeenLive = undefined;
                }

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
                    lastSeenLive,
                } as CharacterInfo;
            });
    });

    return {
        factions: factionInfos,
        characters: characterInfos,
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        const response = await fetchCharacters(apiClient, dataSource);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
