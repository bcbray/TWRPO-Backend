import {
    Entity,
    Column,
    Index,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';

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
}
