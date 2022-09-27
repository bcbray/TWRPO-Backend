/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class ServerGameId1664268455470 implements MigrationInterface {
    name = 'ServerGameId1664268455470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "game" ("twitchId", "key", "name", "boxArtUrl")
                VALUES ('493959', 'rdr2', 'Red Dead Redemption 2', 'https://static-cdn.jtvnw.net/ttv-boxart/493959_IGDB-{width}x{height}.jpg');
        `);

        await queryRunner.query(`ALTER TABLE "server" ADD "gameId" integer`);
        await queryRunner.query(`UPDATE "server" SET "gameId" = game.id FROM game WHERE game.key = 'rdr2'`);
        await queryRunner.query(`ALTER TABLE "server" ALTER COLUMN "gameId" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "gameId"`);
        await queryRunner.query(`DELETE FROM "game" WHERE "key" = 'rdr2'`);
    }

}
