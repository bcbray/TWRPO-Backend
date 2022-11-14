/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProcessingThumbnailsAgain1668442450700 implements MigrationInterface {
    name = 'RemoveProcessingThumbnailsAgain1668442450700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create a rollback point of the data we'll be removing
        await queryRunner.query(`
            CREATE TABLE video_1668442450700_removed_again AS
            SELECT * FROM "video"
            WHERE "thumbnailUrl" = 'https://vod-secure.twitch.tv/_404/404_processing_%{width}x%{height}.png'
        `);

        // Clear the 404 thumbnails
        await queryRunner.query(`
            UPDATE "video"
            SET "thumbnailUrl" = NULL
            WHERE "thumbnailUrl" = 'https://vod-secure.twitch.tv/_404/404_processing_%{width}x%{height}.png'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore the old thumbnails
        await queryRunner.query(`
            UPDATE "video"
            SET "thumbnailUrl" = video_1668442450700_removed_again."thumbnailUrl"
            FROM video_1668442450700_removed_again
            WHERE video.id = video_1668442450700_removed_again.id
        `);

        // Drop the backup
        await queryRunner.query(`
            DROP TABLE "video_1668442450700_removed_again";
        `);
    }

}
