/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkHidden1663189972049 implements MigrationInterface {
    name = 'StreamChunkHidden1663189972049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "isHidden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "isHidden"`);
    }

}
