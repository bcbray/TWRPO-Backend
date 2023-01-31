import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkStats1675134301116 implements MigrationInterface {
    name = 'StreamChunkStats1675134301116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stream_chunk_stat" ("id" SERIAL NOT NULL, "streamChunkId" integer NOT NULL, "time" TIMESTAMP NOT NULL, "viewerCount" integer NOT NULL, CONSTRAINT "PK_38796e255d429282cad22247854" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b829b50be53c209b695536de15" ON "stream_chunk_stat" ("streamChunkId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b829b50be53c209b695536de15"`);
        await queryRunner.query(`DROP TABLE "stream_chunk_stat"`);
    }

}
