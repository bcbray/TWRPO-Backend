/* eslint-disable import/no-cycle */

import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';

import { Server } from './Server';

@Entity()
export class ServerRegex {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    regex: string;

    @Column({ default: false })
    isCaseSensitive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Server, server => server.regexes)
    server: Server;
}
