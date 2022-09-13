import { DataSource } from 'typeorm';

import { StreamChunk } from './entity/StreamChunk';
import { TwitchChannel } from './entity/TwitchChannel';
import { Video } from './entity/Video';
import { Session } from './entity/Session';
import { User } from './entity/User';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [StreamChunk, TwitchChannel, Video, Session, User],
    });
}
