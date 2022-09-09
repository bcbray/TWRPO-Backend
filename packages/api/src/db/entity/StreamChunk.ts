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

@Entity()
@Index('SEEN_INSTANCE', ['streamerId', 'characterId', 'streamId', 'title'], { unique: true, where: '"characterId" IS NOT NULL' })
@Index('SEEN_INSTANCE_NO_CHARACTER', ['streamerId', 'streamId', 'title'], { unique: true, where: '"characterId" IS NULL' })
export class StreamChunk {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    streamerId: string;

    @Column({ nullable: true })
    characterId?: number;

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

    @ManyToOne(() => Video, video => video.streamChunks)
    @JoinColumn({ name: 'streamId', referencedColumnName: 'streamId' })
    video?: Video;
}
/*
id
streamer_id
character_id?
stream_id
stream_start_date
title
first_seen_date
last_seen_date
*/
