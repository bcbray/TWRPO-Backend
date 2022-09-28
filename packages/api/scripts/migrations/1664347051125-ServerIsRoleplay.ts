/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class ServerIsRoleplay1664347051125 implements MigrationInterface {
    name = 'ServerIsRoleplay1664347051125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" ADD "isRoleplay" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`UPDATE "server" SET "isRoleplay" = false WHERE server.name IN ('RDR Story', 'Red Dead Online')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server" DROP COLUMN "isRoleplay"`);
    }

}
