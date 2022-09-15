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

@Entity()
export class StreamChunk {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    streamerId: string;

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

    @ManyToOne(() => Video, video => video.streamChunks)
    @JoinColumn({ name: 'streamId', referencedColumnName: 'streamId' })
    video?: Video;

    @ManyToOne(() => TwitchChannel, channel => channel.streamChunks)
    @JoinColumn({ name: 'streamerId', referencedColumnName: 'twitchId' })
    channel?: TwitchChannel;
}
