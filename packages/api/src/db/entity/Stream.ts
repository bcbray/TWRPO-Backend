import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class Stream {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    videoId: string;

    @Index({ unique: true })
    @Column()
    streamId: string;

    @Index()
    @Column()
    streamerId: string;

    @Column()
    streamCreatedDate: Date;

    @Column()
    streamPublishedDate: Date;

    @Column()
    url: string;

    @Column({ nullable: true })
    thumbnailUrl?: string;

    @Column()
    title: string;

    @Column()
    duration: string;
}
