/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1660336359134 implements MigrationInterface {
    name = 'Initial1660336359134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasTable('stream_chunk')) {
            // We've already initialized the database, no need to do this
            // initial migration (necessary because deployments existed before
            // this “initial setup” migration was created)
            return;
        }
        await queryRunner.query(`CREATE TABLE "stream_chunk" ("id" SERIAL NOT NULL, "streamerId" character varying NOT NULL, "characterId" integer, "characterUncertain" boolean NOT NULL DEFAULT false, "streamId" character varying NOT NULL, "streamStartDate" TIMESTAMP NOT NULL, "title" character varying NOT NULL, "firstSeenDate" TIMESTAMP NOT NULL DEFAULT now(), "lastSeenDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_76d286efc4e8d4e9fd943f8e417" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c112400b9b6660ba4d59148c4d" ON "stream_chunk" ("streamerId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d40a783c2804b34fc23162a6a5" ON "stream_chunk" ("streamerId", "characterId", "streamId", "title") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d40a783c2804b34fc23162a6a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c112400b9b6660ba4d59148c4d"`);
        await queryRunner.query(`DROP TABLE "stream_chunk"`);
    }

}
