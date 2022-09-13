/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveChunkConstraints1663028654972 implements MigrationInterface {
    name = 'RemoveChunkConstraints1663028654972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."SEEN_INSTANCE_NO_CHARACTER"`);
        await queryRunner.query(`DROP INDEX "public"."SEEN_INSTANCE"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "SEEN_INSTANCE" ON "stream_chunk" ("streamerId", "characterId", "streamId", "title") WHERE ("characterId" IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "SEEN_INSTANCE_NO_CHARACTER" ON "stream_chunk" ("streamerId", "streamId", "title") WHERE ("characterId" IS NULL)`);
    }

}
