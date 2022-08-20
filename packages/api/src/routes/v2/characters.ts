import { Router } from 'express';
import { ApiClient } from 'twitch';
import { DataSource } from 'typeorm';
import { CharactersResponse } from '@twrpo/types';

import { wrpCharacters } from '../../data/characters';
import { getWrpLive } from '../live/liveData';
import { getCharacterInfo } from '../../characterUtils';
import { getKnownTwitchUsers } from '../../pfps';
import { fetchFactions } from './factions';
import { StreamSegment } from '../../db/entity/StreamSegment';

export interface CharactersRequest {
    limit?: number;
    page?: number;
}

export const fetchCharacters = async (apiClient: ApiClient, dataSource: DataSource): Promise<CharactersResponse> => {
    const knownUsers = await getKnownTwitchUsers(apiClient, dataSource);

    const liveData = await getWrpLive(apiClient, dataSource);

    const { factions: factionInfos } = await fetchFactions(apiClient, dataSource);

    const streamSegments = await dataSource
        .getRepository(StreamSegment)
        .createQueryBuilder('segment')
        .distinctOn(['segment.twitchChannelId', 'segment.characterId'])
        .orderBy('segment.twitch_channel_id', 'ASC')
        .addOrderBy('segment.character_id', 'ASC')
        .addOrderBy('segment.last_seen_date', 'DESC')
        .getMany();

    const seen: Record<string, Record<number, StreamSegment>> = {};
    streamSegments.forEach((segment) => {
        if (!segment.characterId) {
            return;
        }
        if (segment.characterUncertain) {
            return;
        }
        if (!seen[segment.twitchChannelId]) {
            seen[segment.twitchChannelId] = {};
        }
        seen[segment.twitchChannelId][segment.characterId] = segment;
    });

    const factionMap = Object.fromEntries(factionInfos.map(f => [f.key, f]));

    const characterInfos = Object.entries(wrpCharacters).flatMap(([streamer, characters]) => {
        const channelInfo = knownUsers.find(u =>
            u.displayName.toLowerCase() === streamer.toLowerCase()
            || u.login.toLowerCase() == streamer.toLowerCase());
        return characters
            .filter(character => character.assume !== 'neverNp')
            .map((character) => {
                const characterInfo = getCharacterInfo(streamer, character, channelInfo, factionMap);

                characterInfo.liveInfo = liveData.streams.find(s =>
                    s.channelName === streamer
                    && s.characterName === character.name);

                if (channelInfo?.id
                    && seen[channelInfo?.id]
                    && seen[channelInfo?.id][character.id]
                    && seen[channelInfo?.id][character.id].lastSeenDate.getTime() - seen[channelInfo?.id][character.id].firstSeenDate.getTime() > 1000 * 60 * 10
                ) {
                    characterInfo.lastSeenLive = JSON.stringify(
                        seen[channelInfo?.id][character.id].lastSeenDate
                    );
                }

                return characterInfo;
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
