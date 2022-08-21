import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'character', synchronize: false })
export class Character {
    @ViewColumn()
    id: number;

    @ViewColumn()
    name: string;

    @ViewColumn({ name: 'streamer_id' })
    streamerId: number;

    @ViewColumn({ name: 'server_id' })
    serverId: number;

    @ViewColumn({ name: 'sort_order' })
    sortOrder: number;
}
