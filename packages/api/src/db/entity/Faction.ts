import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'faction', synchronize: false })
export class Faction {
    @ViewColumn()
    id: number;

    @ViewColumn()
    key: string;

    @ViewColumn()
    name: string;

    @ViewColumn({ name: 'light_color' })
    lightColor?: string;

    @ViewColumn({ name: 'dark_color' })
    darkColor?: string;

    @ViewColumn({ name: 'server_id' })
    serverId: number;

    @ViewColumn({ name: 'sort_order' })
    sortOrder: number;
}
