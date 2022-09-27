import { DataSource } from 'typeorm';

import { TwitchChannel } from './db/entity/TwitchChannel';
import { wrpCharacters } from './data/characters';

export const syncTracked = async (dataSource: DataSource): Promise<void> => {
    const channelNames = Object.entries(wrpCharacters).reduce((names, [streamer, characters]) => (
        characters.some(c => c.assume === 'neverNp') ? names : [...names, streamer.toLowerCase()]
    ), [] as string[]);
    await dataSource
        .createQueryBuilder()
        .update(TwitchChannel)
        .set({ isTracked: true })
        .where('LOWER(displayName) IN (:...channelNames)', { channelNames })
        .execute();
};
