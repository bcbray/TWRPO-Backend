import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    DeleteDateColumn,
} from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity()
export class Session implements ISession {
    @PrimaryColumn()
    public id: string;

    @Index()
    @Column('bigint', { name: 'expire_at' })
    public expiredAt = Date.now();

    @Column()
    public json: string;

    @DeleteDateColumn({ name: 'destroyed_at' })
    public destroyedAt?: Date;
}
