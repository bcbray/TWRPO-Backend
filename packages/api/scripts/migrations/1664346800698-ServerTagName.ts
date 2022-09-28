/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class ServerTagName1664346800698 implements MigrationInterface {
    name = 'ServerTagName1664346800698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" ADD "tagName" character varying`);
        await queryRunner.query(`UPDATE "server" SET "tagName" = 'WRP' WHERE server.key = 'wrp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "tagName"`);
    }

}
