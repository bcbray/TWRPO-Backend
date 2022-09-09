/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTwitchChannel1660551290102 implements MigrationInterface {
    name = 'AddTwitchChannel1660551290102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasTable('twitch_channel')) {
            return;
        }
        await queryRunner.query(`
            CREATE TABLE "twitch_channel" (
                "id" SERIAL NOT NULL,
                "twitchId" character varying NOT NULL,
                "twitchLogin" character varying NOT NULL,
                "displayName" character varying NOT NULL,
                "profilePhotoUrl" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "twitchCreatedAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_c134c38fe8ed5d1a394d31ffbf1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5984758bd8e163c789bab67182" ON "twitch_channel" ("twitchId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_419f2a2fbe19a9ee1ee7850565" ON "twitch_channel" ("twitchLogin") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c7fd27ff5c36299be45f2a12d0" ON "twitch_channel" ("displayName") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c7fd27ff5c36299be45f2a12d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_419f2a2fbe19a9ee1ee7850565"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5984758bd8e163c789bab67182"`);
        await queryRunner.query(`DROP TABLE "twitch_channel"`);
    }

}
