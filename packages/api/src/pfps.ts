import { ApiClient } from '@twurple/api';
import { DataSource, ILike } from 'typeorm';
import { wrpCharacters } from './data/characters';
import { TwitchChannel } from './db/entity/TwitchChannel';
import { Logger } from './logger';

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

export const getKnownTwitchUsers = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Promise<TwitchUser[]> => {
    if (cachedResults) {
        logger.info('Returing cached users result');
        return cachedResults;
    }

    if (existingPromise) {
        logger.info('Using existing users promise');
        return existingPromise;
    }

    existingPromise = new Promise<TwitchUser[]>(async (resolve, reject) => {
        const toSearch = Object.keys(wrpCharacters);
        let allUsers: TwitchUser[] = [];
        const missingUsers: string[] = [];
        try {
            logger.info(`Starting known users fetch for ${toSearch.length} users`);

            while (toSearch.length > 0) {
                const thisSearch = toSearch.splice(0, fetchLimit);
                logger.info(`Feting ${thisSearch.length} users`);
                const foundUsers = await apiClient.users.getUsersByNames(thisSearch);
                logger.info(`Found ${foundUsers.length} users`);
                const found: TwitchUser[] = foundUsers.map(helixUser => ({
                    id: helixUser.id,
                    login: helixUser.name,
                    displayName: helixUser.displayName,
                    profilePictureUrl: helixUser.profilePictureUrl,
                    createdAt: helixUser.creationDate,
                }));
                allUsers = [...allUsers, ...found];

                const searchedChannels = new Set(thisSearch);
                found.forEach(u => searchedChannels.delete(u.displayName));
                missingUsers.push(...searchedChannels);

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
                    logger.info(`Updated ${updateCount} twitch channels in database`, {
                        count: updateCount,
                    });
                }
            }

            for (const channelName of missingUsers) {
                const channel = await dataSource
                    .getRepository(TwitchChannel)
                    .findOneBy({ displayName: ILike(channelName) });
                if (channel === null) {
                    logger.notice(`Channel "${channelName}" could not be found in database`, {
                        event: 'known-twitch-user-not-found',
                        channel: channelName,
                    });
                    continue;
                }
                const nowUser = await apiClient.users.getUserById(channel.twitchId);
                if (nowUser === null) {
                    logger.notice(`Channel "${channelName}" (${channel.twitchId}) is no longer on Twitch`, {
                        event: 'known-twitch-user-removed',
                        channel: channelName,
                        twitchId: channel.twitchId,
                    });
                    continue;
                }
                // Don’t update in database because we’ll need to update
                // data/characters.ts to keep things in sync. Once Characters
                // move to the database, we should update the db when channels
                // are renamed (perhaps storing the previous name for redirects?)
                logger.warning(`Channel "${channelName}" has been renamed to "${nowUser.displayName}"`, {
                    event: 'known-twitch-user-renamed',
                    previousChannel: channelName,
                    newChannel: nowUser.displayName,
                    twitchId: nowUser.id,
                });
            }

            cachedResults = allUsers;

            resolve(allUsers);
        } catch (err) {
            logger.warning('Failed to fetch known users', {
                event: 'twitch-user-fetch-failed',
                fetchedCount: allUsers.length,
                toFetchCount: toSearch.length,
                error: err,
            });
            reject(err);
        }
    });

    await existingPromise!;

    return cachedResults!;
};
