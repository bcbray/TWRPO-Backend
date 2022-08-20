import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'twitch_channel' })
export class TwitchChannel {
    @Column({
        name: 'twitch_id',
        primary: true,
        primaryKeyConstraintName: 'twitch_channel_pkey',
    })
    twitchId: string;

    @Index('twitch_channel_twitch_login_idx', { unique: true })
    @Column({ name: 'twitch_login' })
    twitchLogin: string;

    @Index('twitch_channel_display_name_idx')
    @Column({ name: 'display_name' })
    displayName: string;

    @Column({ name: 'profile_photo_url' })
    profilePhotoUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'twitch_created_at' })
    twitchCreatedAt: Date;
}
