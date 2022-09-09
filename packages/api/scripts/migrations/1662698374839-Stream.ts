/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class Stream1662698374839 implements MigrationInterface {
    name = 'Stream1662698374839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stream" ("id" SERIAL NOT NULL, "videoId" character varying NOT NULL, "streamId" character varying NOT NULL, "streamerId" character varying NOT NULL, "streamCreatedDate" TIMESTAMP NOT NULL, "streamPublishedDate" TIMESTAMP NOT NULL, "url" character varying NOT NULL, "thumbnailUrl" character varying NOT NULL, "title" character varying NOT NULL, "duration" character varying NOT NULL, CONSTRAINT "PK_0dc9d7e04ff213c08a096f835f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5b32dcb12e6a54e92574ea8803" ON "stream" ("videoId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_21ea159140f3ec2f85eaf77a59" ON "stream" ("streamId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c8fa43feb03b78ef491142a33" ON "stream" ("streamerId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2c8fa43feb03b78ef491142a33"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21ea159140f3ec2f85eaf77a59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b32dcb12e6a54e92574ea8803"`);
        await queryRunner.query(`DROP TABLE "stream"`);
    }

}
