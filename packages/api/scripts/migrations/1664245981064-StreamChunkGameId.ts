/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkGameId1664245981064 implements MigrationInterface {
    name = 'StreamChunkGameId1664245981064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "gameTwitchId" character varying`);
        await queryRunner.query(`UPDATE "stream_chunk" SET "gameTwitchId" = '493959'`);
        await queryRunner.query(`ALTER TABLE "stream_chunk" ALTER COLUMN "gameTwitchId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "gameTwitchId"`);
    }

}
