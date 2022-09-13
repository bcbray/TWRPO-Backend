import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

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
}
