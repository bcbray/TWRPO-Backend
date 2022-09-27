/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class Game1664259790412 implements MigrationInterface {
    name = 'Game1664259790412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "twitchId" character varying NOT NULL, "key" character varying, "name" character varying NOT NULL, "boxArtUrl" character varying, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7941ee0f952a022edb30631996" ON "game" ("twitchId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_58e154d3e982a8e9400aac6c59" ON "game" ("key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_58e154d3e982a8e9400aac6c59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7941ee0f952a022edb30631996"`);
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
