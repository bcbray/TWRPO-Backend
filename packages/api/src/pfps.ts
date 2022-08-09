import { apiClient } from './twitchSetup';
import { wrpCharacters } from './data/characters';
import { log } from './utils';

export interface TwitchUser {
    id: string;
    login: string;
    displayName: string;
    profilePictureUrl: string;
}

const fetchLimit = 100 as const;

let cachedResults: TwitchUser[] | undefined;
let existingPromise: Promise<TwitchUser[]> | undefined;

export const getKnownTwitchUsers = async (): Promise<TwitchUser[]> => {
    if (cachedResults) {
        log('Returing cached users result');
        return cachedResults;
    }

    if (existingPromise) {
        log('Using existing users promise');
        return existingPromise;
    }

    existingPromise = new Promise<TwitchUser[]>(async (resolve, reject) => {
        try {
            const toSearch = Object.keys(wrpCharacters);
            let allUsers: TwitchUser[] = [];

            log(`Starting known users fetch for ${toSearch.length} users`);

            while (toSearch.length > 0) {
                const thisSearch = toSearch.splice(0, fetchLimit);
                log(`Feting ${thisSearch.length} users`);
                const foundUsers = await apiClient.helix.users.getUsersByNames(thisSearch);
                log(`Found ${foundUsers.length} users`);
                const found: TwitchUser[] = foundUsers.map(helixUser => ({
                    id: helixUser.id,
                    login: helixUser.name,
                    displayName: helixUser.displayName,
                    profilePictureUrl: helixUser.profilePictureUrl,
                }));
                allUsers = [...allUsers, ...found];
            }

            cachedResults = allUsers;

            resolve(allUsers);
        } catch (err) {
            log('Failed to fetch user data:', err);
            reject(err);
        }
    });

    await existingPromise!;

    return cachedResults!;
};
