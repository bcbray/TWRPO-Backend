import path from 'path';
import { DataSource } from 'typeorm';

import { StreamChunk } from './entity/StreamChunk';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [StreamChunk],
        migrations: [path.resolve(__dirname, 'migration/*.ts')],
        subscribers: [],
    });
}
