import { DataSource } from 'typeorm';

import { StreamSegment } from './entity/StreamSegment';
import { TwitchChannel } from './entity/TwitchChannel';
import { Character } from './entity/Character';
import { Nickname } from './entity/Nickname';
import { Regex } from './entity/Regex';
import { Faction } from './entity/Faction';
import { FactionMembership } from './entity/FactionMembership';
import { Game } from './entity/Game';
import { Server } from './entity/Server';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        ssl: { rejectUnauthorized: false },
        entities: [
            StreamSegment,
            TwitchChannel,
            Character,
            Nickname,
            Regex,
            Faction,
            FactionMembership,
            Game,
            Server,
        ],
    });
}
