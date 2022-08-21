/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServerNicknameType1661053964214 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE nickname_type ADD VALUE IF NOT EXISTS 'server'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverting the nickname_type change is a pain in the ass (we have to
        // recreate the enum and alter the columns, and that can only be done if
        // we drop and recreate all views that depend on tables that have a
        // column using this type). So, we'll just have a lingering enum value
        // in this scenario.

        await queryRunner.query(`
            DELETE FROM raw_nickname WHERE foreign_type = 'server'
        `);

        await queryRunner.query(`
            DELETE FROM raw_regex WHERE foreign_type = 'server';
        `);
    }
}
