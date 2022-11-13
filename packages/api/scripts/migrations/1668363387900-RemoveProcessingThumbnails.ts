/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProcessingThumbnails1668363387900 implements MigrationInterface {
    name = 'RemoveProcessingThumbnails1668363387900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create a rollback point of the data we'll be removing
        await queryRunner.query(`
            CREATE TABLE video_1668363387900_removed AS
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
            SET "thumbnailUrl" = video_1668363387900_removed."thumbnailUrl"
            FROM video_1668363387900_removed
            WHERE video.id = video_1668363387900_removed.id
        `);

        // Drop the backup
        await queryRunner.query(`
            DROP TABLE "video_1668363387900_removed";
        `);
    }

}
