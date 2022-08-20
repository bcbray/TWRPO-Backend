/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameStreamChunk1660879369731 implements MigrationInterface {
    name = 'RenameStreamChunk1660879369731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE stream_chunk
                RENAME TO stream_segment
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "streamerId" TO twitch_channel_id
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "characterId" TO character_id
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "streamId" TO twitch_stream_id
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "streamStartDate" TO stream_start_date
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "firstSeenDate" TO first_seen_date
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ALTER COLUMN first_seen_date DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "lastSeenDate" TO last_seen_date
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME "characterUncertain" TO character_uncertain
        `);

        await queryRunner.query(`
            ALTER INDEX "SEEN_INSTANCE_NO_CHARACTER"
                RENAME TO stream_segment_instance_no_character_idx
        `);

        await queryRunner.query(`
            ALTER INDEX "SEEN_INSTANCE"
                RENAME TO stream_segment_instance_idx
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME CONSTRAINT "PK_76d286efc4e8d4e9fd943f8e417" TO stream_segment_pkey
        `);

        await queryRunner.query(`
            ALTER INDEX "IDX_c112400b9b6660ba4d59148c4d"
                RENAME TO stream_segment_twitch_channel_id_idx
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME twitch_channel_id TO "streamerId"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME character_id TO "characterId"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME twitch_stream_id TO "streamId"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME stream_start_date TO "streamStartDate"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME first_seen_date TO "firstSeenDate"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ALTER COLUMN "firstSeenDate" SET DEFAULT now()
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME last_seen_date TO "lastSeenDate"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME character_uncertain TO "characterUncertain"
        `);

        await queryRunner.query(`
            ALTER INDEX stream_segment_instance_no_character_idx
                RENAME TO "SEEN_INSTANCE_NO_CHARACTER"
        `);

        await queryRunner.query(`
            ALTER INDEX stream_segment_instance_idx
                RENAME TO "SEEN_INSTANCE"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME CONSTRAINT stream_segment_pkey TO "PK_76d286efc4e8d4e9fd943f8e417"
        `);

        await queryRunner.query(`
            ALTER INDEX stream_segment_twitch_channel_id_idx
                RENAME TO "IDX_c112400b9b6660ba4d59148c4d"
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                RENAME TO stream_chunk
        `);
    }

}
