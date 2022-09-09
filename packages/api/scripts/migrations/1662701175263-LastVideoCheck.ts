/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class LastVideoCheck1662701175263 implements MigrationInterface {
    name = 'LastVideoCheck1662701175263';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitch_channel" ADD "lastVideoCheck" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitch_channel" DROP COLUMN "lastVideoCheck"`);
    }
}
