import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'server', synchronize: false })
export class Server {
    @ViewColumn()
    id: number;

    @ViewColumn()
    key: string;

    @ViewColumn({ name: 'game_id' })
    gameId: number;

    @ViewColumn({ name: 'sort_order' })
    sortOrder: number;
}
