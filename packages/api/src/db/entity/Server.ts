/* eslint-disable import/no-cycle */

import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';

import { ServerRegex } from './ServerRegex';

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({
        type: 'character varying',
        nullable: true,
    })
    key: string | null;

    @Column()
    name: string;

    @Column({ default: false })
    isVisible: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    sortOrder: number;

    @OneToMany(() => ServerRegex, regex => regex.server)
    regexes: ServerRegex[];
}
