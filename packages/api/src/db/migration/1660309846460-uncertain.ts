/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class uncertain1660309846460 implements MigrationInterface {
    name = 'uncertain1660309846460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "characterUncertain" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "characterUncertain"`);
    }

}
