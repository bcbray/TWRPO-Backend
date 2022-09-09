/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamToVideo1662706675467 implements MigrationInterface {
    name = 'StreamToVideo1662706675467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream" RENAME TO "video"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video" RENAME TO "stream"`);
    }

}
