import { ApiClient } from '@twurple/api';
import { DataSource } from 'typeorm';
import { wrpCharacters } from './data/characters';
import { log } from './utils';
import { TwitchChannel } from './db/entity/TwitchChannel';

export interface TwitchUser {
    id: string;
    login: string;
    displayName: string;
    profilePictureUrl: string;
    createdAt: Date;
}

const fetchLimit = 100 as const;

let cachedResults: TwitchUser[] | undefined;
let existingPromise: Promise<TwitchUser[]> | undefined;

export const getKnownTwitchUsers = async (apiClient: ApiClient, dataSource: DataSource): Promise<TwitchUser[]> => {
    if (cachedResults) {
        log('Returing cached users result');
        return cachedResults;
    }

    if (existingPromise) {
        log('Using existing users promise');
        return existingPromise;
    }

    existingPromise = new Promise<TwitchUser[]>(async (resolve, reject) => {
        const toSearch = Object.keys(wrpCharacters);
        let allUsers: TwitchUser[] = [];
        try {
            log(`Starting known users fetch for ${toSearch.length} users`);

            while (toSearch.length > 0) {
                const thisSearch = toSearch.splice(0, fetchLimit);
                log(`Feting ${thisSearch.length} users`);
                const foundUsers = await apiClient.users.getUsersByNames(thisSearch);
                log(`Found ${foundUsers.length} users`);
                const found: TwitchUser[] = foundUsers.map(helixUser => ({
                    id: helixUser.id,
                    login: helixUser.name,
                    displayName: helixUser.displayName,
                    profilePictureUrl: helixUser.profilePictureUrl,
                    createdAt: helixUser.creationDate,
                }));
                allUsers = [...allUsers, ...found];

                const twitchChannels: Partial<TwitchChannel>[] = found.map(u => ({
                    twitchId: u.id,
                    twitchLogin: u.login,
                    displayName: u.displayName,
                    profilePhotoUrl: u.profilePictureUrl,
                    twitchCreatedAt: u.createdAt,
                }));

                const result = await dataSource
                    .getRepository(TwitchChannel)
                    .upsert(twitchChannels, {
                        conflictPaths: ['twitchId'],
                        skipUpdateIfNoValuesChanged: true,
                    });
                const updateCount = result.identifiers.reduce((count, id) => (
                    id ? count + 1 : count
                ), 0);
                if (updateCount) {
                    console.log(JSON.stringify({
                        level: 'info',
                        message: `Updated ${updateCount} twitch channels in database`,
                        count: updateCount,
                    }));
                }
            }

            cachedResults = allUsers;

            resolve(allUsers);
        } catch (err) {
            console.log(JSON.stringify({
                level: 'warning',
                message: 'Failed to fetch known users',
                event: 'twitch-user-fetch-failed',
                fetchedCount: allUsers.length,
                toFetchCount: toSearch.length,
                error: err,
            }));
            reject(err);
        }
    });

    await existingPromise!;

    return cachedResults!;
};
