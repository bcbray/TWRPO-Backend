/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class SessionAndUser1663053255966 implements MigrationInterface {
    name = 'SessionAndUser1663053255966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" character varying NOT NULL, "expire_at" bigint NOT NULL, "json" character varying NOT NULL, "destroyed_at" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9185c3e1cab18350b0223777b2" ON "session" ("expire_at") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "twitchId" character varying NOT NULL, "twitchAccessToken" character varying, "twitchRefreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a1a2bf2247f46469df0eddf2b3" ON "user" ("twitchId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a1a2bf2247f46469df0eddf2b3"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9185c3e1cab18350b0223777b2"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
