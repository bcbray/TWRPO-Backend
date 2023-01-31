import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
} from 'typeorm';


@Entity()
export class StreamChunkStat {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    streamChunkId: number;

    // TODO: @Index() once we have enough data to determine a good BRIN pages_per_range value
    @Column()
    time: Date;

    @Column()
    viewerCount: number;
}
