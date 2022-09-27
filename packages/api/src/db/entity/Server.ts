/* eslint-disable import/no-cycle */

import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { ServerRegex } from './ServerRegex';
import { StreamChunk } from './StreamChunk';
import { Game } from './Game';

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    gameId: number;

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

    @ManyToOne(() => Game, game => game.servers)
    @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
    game?: Game;

    @OneToMany(() => ServerRegex, regex => regex.server)
    regexes: ServerRegex[];

    @OneToMany(() => StreamChunk, chunk => chunk.video)
    streamChunks?: StreamChunk[];
}
