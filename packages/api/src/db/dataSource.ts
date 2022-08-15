import { DataSource } from 'typeorm';

import { StreamChunk } from './entity/StreamChunk';
import { TwitchChannel } from './entity/TwitchChannel';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [StreamChunk, TwitchChannel],
    });
}
