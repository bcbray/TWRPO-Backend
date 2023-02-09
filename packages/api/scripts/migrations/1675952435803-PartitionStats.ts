import { MigrationInterface, QueryRunner } from "typeorm";

export class PartitionStats1675952435803 implements MigrationInterface {
    name = 'PartitionStats1675952435803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE stream_chunk_stat RENAME to stream_chunk_stat_unpartitioned`);
        await queryRunner.query(`ALTER INDEX "IDX_b829b50be53c209b695536de15" RENAME to "IDX_a0f6c4332a42b300100f4faa5d"`);
        await queryRunner.query(`ALTER INDEX "IDX_40dc6325fff47659ffc2b138ba" RENAME to "IDX_b9515d986f3aaad0733479b57e"`);
        await queryRunner.query(`ALTER SEQUENCE "stream_chunk_stat_id_seq" RENAME TO "stream_chunk_stat_unpartitioned_id_seq"`);
        await queryRunner.query(`CREATE TABLE "stream_chunk_stat" ("id" SERIAL NOT NULL, "streamChunkId" integer NOT NULL, "time" TIMESTAMP NOT NULL, "viewerCount" integer NOT NULL) PARTITION BY RANGE("time")`);
        await queryRunner.query(`CREATE INDEX "IDX_38796e255d429282cad2224785" ON "stream_chunk_stat" ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_b829b50be53c209b695536de15" ON "stream_chunk_stat" ("streamChunkId")`);
        await queryRunner.query(`CREATE INDEX "IDX_40dc6325fff47659ffc2b138ba" ON "stream_chunk_stat" USING BRIN ("time") WITH (pages_per_range = 70 )`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_partman`);
        await queryRunner.query(`SELECT create_parent('public.stream_chunk_stat', 'time', 'native', 'daily', p_start_partition := '2023-01-29')`);
        await queryRunner.query(`INSERT INTO stream_chunk_stat SELECT * FROM stream_chunk_stat_unpartitioned`);
        await queryRunner.query(`SELECT setval('stream_chunk_stat_id_seq', (SELECT MAX(id) FROM stream_chunk_stat))`);
        await queryRunner.query(`DROP TABLE stream_chunk_stat_unpartitioned`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stream_chunk_stat_unpartitioned" ("id" SERIAL NOT NULL, "streamChunkId" integer NOT NULL, "time" TIMESTAMP NOT NULL, "viewerCount" integer NOT NULL, CONSTRAINT "PK_38796e255d429282cad22247854" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0f6c4332a42b300100f4faa5d" ON "stream_chunk_stat_unpartitioned" ("streamChunkId")`);
        await queryRunner.query(`CREATE INDEX "IDX_b9515d986f3aaad0733479b57e" ON "stream_chunk_stat_unpartitioned" USING BRIN ("time") WITH (pages_per_range = 70 )`);
        await queryRunner.query(`SELECT undo_partition('public.stream_chunk_stat', 300, p_keep_table := false, p_target_table := 'public.stream_chunk_stat_unpartitioned')`);
        await queryRunner.query(`DROP TABLE stream_chunk_stat`);
        await queryRunner.query(`ALTER SEQUENCE "stream_chunk_stat_unpartitioned_id_seq" RENAME TO "stream_chunk_stat_id_seq"`);
        await queryRunner.query(`ALTER INDEX "IDX_a0f6c4332a42b300100f4faa5d" RENAME to "IDX_b829b50be53c209b695536de15"`);
        await queryRunner.query(`ALTER INDEX "IDX_b9515d986f3aaad0733479b57e" RENAME to "IDX_40dc6325fff47659ffc2b138ba"`);
        await queryRunner.query(`ALTER TABLE stream_chunk_stat_unpartitioned RENAME to stream_chunk_stat`);
        await queryRunner.query(`SELECT setval('stream_chunk_stat_id_seq', (SELECT MAX(id) FROM stream_chunk_stat))`);
    }

}
