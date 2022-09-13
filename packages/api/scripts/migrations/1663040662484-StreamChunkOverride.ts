/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkOverride1663040662484 implements MigrationInterface {
    name = 'StreamChunkOverride1663040662484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "isOverridden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "isOverridden"`);
    }

}
