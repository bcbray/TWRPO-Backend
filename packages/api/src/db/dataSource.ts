import { DataSource } from 'typeorm';

import { StreamSegment } from './entity/StreamSegment';
import { TwitchChannel } from './entity/TwitchChannel';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [
            StreamSegment,
            TwitchChannel,
        ],
    });
}
