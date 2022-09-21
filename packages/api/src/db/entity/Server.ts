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
import { StreamChunk } from './StreamChunk';

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

    @OneToMany(() => StreamChunk, chunk => chunk.video)
    streamChunks?: StreamChunk[];
}
