import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
} from 'typeorm';

@Index('stream_segment_instance_idx',
    ['twitchChannelId', 'characterId', 'twitchStreamId', 'title'],
    { unique: true, where: '"character_id" IS NOT NULL' })
@Index('stream_segment_instance_no_character_idx',
    ['twitchChannelId', 'twitchStreamId', 'title'],
    { unique: true, where: '"character_id" IS NULL' })
@Entity({ name: 'stream_segment' })
export class StreamSegment {
    @PrimaryGeneratedColumn({
        primaryKeyConstraintName: 'stream_segment_pkey',
    })
    id: number;

    @Index('stream_segment_twitch_channel_id_idx')
    @Column({ name: 'twitch_channel_id' })
    twitchChannelId: string;

    @Column({
        name: 'character_id',
        nullable: true,
        default: null,
    })
    characterId?: number;

    @Column({
        name: 'character_uncertain',
        default: false,
    })
    characterUncertain: boolean;

    @Column({ name: 'twitch_stream_id' })
    twitchStreamId: string;

    @Column({ name: 'stream_start_date' })
    streamStartDate: Date;

    @Column()
    title: string;

    @CreateDateColumn({ name: 'first_seen_date' })
    firstSeenDate: Date;

    @Column({ name: 'last_seen_date' })
    lastSeenDate: Date;
}
