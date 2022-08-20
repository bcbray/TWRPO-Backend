import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'faction_rank', synchronize: false })
export class FactionRank {
    @ViewColumn()
    id: number;

    @ViewColumn({ name: 'faction_id' })
    characterId: number;

    @ViewColumn()
    name: string;

    @ViewColumn({ name: 'display_name' })
    displayName: string;
}
