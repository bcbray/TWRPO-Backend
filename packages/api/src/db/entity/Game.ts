/* eslint-disable import/no-cycle */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
} from 'typeorm';

import { StreamChunk } from './StreamChunk';
import { Server } from './Server';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    twitchId: string;

    @Index({ unique: true })
    @Column({
        type: 'character varying',
        nullable: true,
    })
    key: string | null;

    @Column()
    name: string;

    @Column({ nullable: true })
    boxArtUrl?: string;

    @OneToMany(() => Server, server => server.game)
    servers?: Server[];

    @OneToMany(() => StreamChunk, chunk => chunk.video)
    streamChunks?: StreamChunk[];
}
