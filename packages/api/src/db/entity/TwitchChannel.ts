import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    CreateDateColumn,
} from 'typeorm';

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
}
