import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'game', synchronize: false })
export class Game {
    @ViewColumn()
    id: number;

    @ViewColumn()
    key: string;

    @ViewColumn({ name: 'twitch_id' })
    twitchId: string;

    @ViewColumn({ name: 'sort_order' })
    sortOrder: number;
}
