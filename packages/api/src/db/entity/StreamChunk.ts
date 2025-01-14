/* eslint-disable import/no-cycle */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Video } from './Video';
import { TwitchChannel } from './TwitchChannel';
import { Server } from './Server';
import { Game } from './Game';

@Entity()
export class StreamChunk {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    streamerId: string;

    @Column({ nullable: false })
    gameTwitchId: string;

    @Column({
        type: 'int',
        nullable: true,
    })
    serverId: number | null;

    @Column({ default: false })
    serverUncertain: boolean;

    @Column({
        type: 'int',
        nullable: true,
    })
    characterId: number | null;

    @Column({ default: false })
    characterUncertain: boolean;

    @Column()
    streamId: string;

    @Column()
    streamStartDate: Date;

    @Column()
    title: string;

    @CreateDateColumn()
    firstSeenDate: Date;

    @Column()
    lastSeenDate: Date;

    @Column({ default: 0 })
    lastViewerCount: number;

    @Column({ default: false })
    isOverridden: boolean;

    @Column({ default: false })
    isHidden: boolean;

    @Column({ default: false })
    isLive: boolean;

    @ManyToOne(() => Server, server => server.streamChunks)
    @JoinColumn({ name: 'serverId', referencedColumnName: 'id' })
    server?: Server;

    @ManyToOne(() => Video, video => video.streamChunks)
    @JoinColumn({ name: 'streamId', referencedColumnName: 'streamId' })
    video?: Video;

    @ManyToOne(() => TwitchChannel, channel => channel.streamChunks)
    @JoinColumn({ name: 'streamerId', referencedColumnName: 'twitchId' })
    channel?: TwitchChannel;

    @ManyToOne(() => Game, game => game.streamChunks)
    @JoinColumn({ name: 'gameTwitchId', referencedColumnName: 'twitchId' })
    game?: Game;
}
