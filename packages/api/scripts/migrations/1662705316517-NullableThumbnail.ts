/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableThumbnail1662705316517 implements MigrationInterface {
    name = 'NullableThumbnail1662705316517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream" ALTER COLUMN "thumbnailUrl" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream" ALTER COLUMN "thumbnailUrl" SET NOT NULL`);
    }

}
