import { DataSource } from 'typeorm';

import { StreamChunk } from './entity/StreamChunk';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [StreamChunk],
    });
}
