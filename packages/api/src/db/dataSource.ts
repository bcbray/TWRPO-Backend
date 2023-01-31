import { DataSource } from 'typeorm';

import { StreamChunk } from './entity/StreamChunk';
import { TwitchChannel } from './entity/TwitchChannel';
import { Video } from './entity/Video';
import { Session } from './entity/Session';
import { User } from './entity/User';
import { Server } from './entity/Server';
import { ServerRegex } from './entity/ServerRegex';
import { Game } from './entity/Game';
import { StreamChunkStat } from './entity/StreamChunkStat';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [
            StreamChunk,
            TwitchChannel,
            Video,
            Session,
            User,
            Server,
            ServerRegex,
            Game,
            StreamChunkStat,
        ],
    });
}
