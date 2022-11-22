/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkUncertainServer1669155341157 implements MigrationInterface {
    name = 'StreamChunkUncertainServer1669155341157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "serverUncertain" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "serverUncertain"`);
    }

}
