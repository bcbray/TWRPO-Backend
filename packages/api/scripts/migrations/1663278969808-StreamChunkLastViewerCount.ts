/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkLastViewerCount1663278969808 implements MigrationInterface {
    name = 'StreamChunkLastViewerCount1663278969808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "lastViewerCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "lastViewerCount"`);
    }

}
