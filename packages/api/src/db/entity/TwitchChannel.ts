/* eslint-disable import/no-cycle */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { StreamChunk } from './StreamChunk';
import { User } from './User';

@Entity()
export class TwitchChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    twitchId: string;

    @Index({ unique: true })
    @Column()
    twitchLogin: string;

    @Index({ unique: true })
    @Column()
    displayName: string;

    @Column()
    profilePhotoUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    twitchCreatedAt: Date;

    @Column({ nullable: true })
    lastVideoCheck: Date;

    @OneToMany(() => StreamChunk, chunk => chunk.channel)
    streamChunks?: StreamChunk[];

    @OneToOne(() => User, user => user.channel)
    user?: User;
}
