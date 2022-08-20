import { ViewEntity, ViewColumn } from 'typeorm';

export type ForeignType = 'character' | 'faction';

@ViewEntity({ name: 'nickname', synchronize: false })
export class Nickname {
    @ViewColumn()
    id: number;

    @ViewColumn({ name: 'foreign_id' })
    foreignId: number;

    @ViewColumn({ name: 'foreign_type' })
    foreignType: ForeignType;

    @ViewColumn()
    nickname: string;
}
