/* eslint-disable import/no-cycle */

import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import { TwitchChannel } from './TwitchChannel';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    GUEST = 'guest'
}

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    twitchId: string;

    @Column({ nullable: true })
    twitchAccessToken: string;

    @Column({ nullable: true })
    twitchRefreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.GUEST,
    })
    globalRole: UserRole;

    @OneToOne(() => TwitchChannel, channel => channel.streamChunks)
    @JoinColumn({ name: 'twitchId', referencedColumnName: 'twitchId' })
    channel: TwitchChannel;
}
