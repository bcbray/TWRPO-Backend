/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class nullCharacterIndex1660355289987 implements MigrationInterface {
    name = 'nullCharacterIndex1660355289987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // - Consolidate duplicated NULL character stream chunks

        // Create a rollback point of the data we'll be removing
        await queryRunner.query(`
            CREATE TABLE stream_chunk_1660355289987_removed AS
            SELECT * FROM "stream_chunk"
            WHERE "characterId" IS NULL;
        `);

        // Create a temporary table to hold consolidate data
        await queryRunner.query(`
            CREATE TEMP TABLE null_characters(
                "id" int4 NOT NULL,
                "streamerId" character varying NOT NULL,
                "characterId" integer NULL,
                "characterUncertain" boolean NOT NULL DEFAULT false,
                "streamId" character varying NOT NULL,
                "streamStartDate" timestamp without time zone NOT NULL,
                "title" character varying NOT NULL,
                "firstSeenDate" timestamp without time zone NOT NULL DEFAULT now(),
                "lastSeenDate" timestamp without time zone NOT NULL
            );
        `);

        // Insert ranged start and end for NULL characters
        await queryRunner.query(`
            INSERT INTO "null_characters" SELECT
                MIN("id") as "id",
                "streamerId",
                NULL,
                false,
                "streamId",
                "streamStartDate",
                "title",
                MIN("firstSeenDate") as "streamStartDate",
                MAX("lastSeenDate") as "lastSeenDate"
            FROM "stream_chunk"
            WHERE "characterId" IS NULL
            GROUP BY "streamerId", "streamId", "title", "streamStartDate";
        `);

        // Drop the original rows
        await queryRunner.query(`
            DELETE FROM "stream_chunk"
            WHERE "characterId" IS NULL;
        `);

        // Insert the consolidate rows
        await queryRunner.query(`
            INSERT INTO "stream_chunk" (
                "id",
                "streamerId",
                "characterId",
                "characterUncertain",
                "streamId",
                "streamStartDate",
                "title",
                "firstSeenDate",
                "lastSeenDate"
            )
            SELECT
                "id",
                "streamerId",
                "characterId",
                "characterUncertain",
                "streamId",
                "streamStartDate",
                "title",
                "firstSeenDate",
                "lastSeenDate"
            FROM "null_characters";
        `);

        // - Set up the indices as defined by typeorm
        await queryRunner.query(`DROP INDEX "public"."IDX_d40a783c2804b34fc23162a6a5"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "SEEN_INSTANCE_NO_CHARACTER" ON "stream_chunk" ("streamerId", "streamId", "title") WHERE "characterId" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "SEEN_INSTANCE" ON "stream_chunk" ("streamerId", "characterId", "streamId", "title") WHERE "characterId" IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // - Roll back indices as defined by typeorm
        await queryRunner.query(`DROP INDEX "public"."SEEN_INSTANCE"`);
        await queryRunner.query(`DROP INDEX "public"."SEEN_INSTANCE_NO_CHARACTER"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d40a783c2804b34fc23162a6a5" ON "stream_chunk" ("streamerId", "characterId", "streamId", "title") `);

        // - Restore consolidated rows from our backup table

        // Remove rows that are present in the backup (they were consolidated in the migration)
        await queryRunner.query(`
            DELETE FROM "stream_chunk"
            WHERE "id" IN
            (SELECT "id" FROM "stream_chunk_1660355289987_removed");
        `);

        // Pull data from the backup
        await queryRunner.query(`
            INSERT INTO "stream_chunk" (
                "id",
                "streamerId",
                "characterId",
                "characterUncertain",
                "streamId",
                "streamStartDate",
                "title",
                "firstSeenDate",
                "lastSeenDate"
            )
            SELECT
                "id",
                "streamerId",
                "characterId",
                "characterUncertain",
                "streamId",
                "streamStartDate",
                "title",
                "firstSeenDate",
                "lastSeenDate"
            FROM "stream_chunk_1660355289987_removed";
        `);

        // Restore the backup
        await queryRunner.query(`
            DROP TABLE "stream_chunk_1660355289987_removed";
        `);
    }

}
