/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkIsLive1664395881280 implements MigrationInterface {
    name = 'StreamChunkIsLive1664395881280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "isLive" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "isLive"`);
    }

}
