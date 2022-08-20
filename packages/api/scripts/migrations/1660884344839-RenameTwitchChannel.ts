/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm"

export class RenameTwitchChannel1660884344839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create a rollback point of the column we'll be removing
        await queryRunner.query(`
            CREATE TABLE twitch_channel_1660884344839_ids AS
            SELECT id, "twitchId" FROM twitch_channel
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                DROP COLUMN id
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "twitchId" TO twitch_id
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "twitchLogin" TO twitch_login
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "displayName" TO display_name
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "profilePhotoUrl" TO profile_photo_url
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "createdAt" TO created_at
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME "twitchCreatedAt" TO twitch_created_at
        `);

        await queryRunner.query(`
            ALTER INDEX "IDX_5984758bd8e163c789bab67182"
                RENAME TO twitch_channel_twitch_id_idx
        `);

        await queryRunner.query(`
            ALTER INDEX "IDX_419f2a2fbe19a9ee1ee7850565"
                RENAME TO twitch_channel_twitch_login_idx
        `);

        await queryRunner.query(`
            ALTER INDEX "IDX_c7fd27ff5c36299be45f2a12d0"
                RENAME TO twitch_channel_display_name_idx
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                ADD CONSTRAINT twitch_channel_pkey PRIMARY KEY(twitch_id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME twitch_id TO "twitchId"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME twitch_login TO "twitchLogin"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME display_name TO "displayName"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME profile_photo_url TO "profilePhotoUrl"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME created_at TO "createdAt"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                RENAME twitch_created_at TO "twitchCreatedAt"
        `);

        await queryRunner.query(`
            ALTER INDEX twitch_channel_twitch_id_idx
                RENAME TO "IDX_5984758bd8e163c789bab67182"
        `);

        await queryRunner.query(`
            ALTER INDEX twitch_channel_twitch_login_idx
                RENAME TO "IDX_419f2a2fbe19a9ee1ee7850565"
        `);

        await queryRunner.query(`
            ALTER INDEX twitch_channel_display_name_idx
                RENAME TO "IDX_c7fd27ff5c36299be45f2a12d0"
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                DROP CONSTRAINT twitch_channel_pkey
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                ADD COLUMN id serial NOT NULL
        `);

        // Restore the previous ids
        await queryRunner.query(`
            UPDATE twitch_channel
                SET id = twitch_channel_1660884344839_ids.id
                FROM twitch_channel_1660884344839_ids
                WHERE twitch_channel."twitchId" = twitch_channel_1660884344839_ids."twitchId"
        `);

        await queryRunner.query(`
            DROP TABLE twitch_channel_1660884344839_ids
        `)

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                ADD CONSTRAINT "PK_c134c38fe8ed5d1a394d31ffbf1" PRIMARY KEY (id)
        `);
    }

}
