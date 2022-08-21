import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'faction_membership', synchronize: false })
export class FactionMembership {
    @ViewColumn({ name: 'character_id' })
    characterId: number;

    @ViewColumn({ name: 'faction_id' })
    factionId: number;

    @ViewColumn({ name: 'is_leader' })
    isLeader: boolean;

    @ViewColumn({ name: 'rank_id' })
    rankId: number;

    @ViewColumn({ name: 'sort_order' })
    sortOrder: number;
}
