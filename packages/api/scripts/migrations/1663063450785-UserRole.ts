/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRole1663063450785 implements MigrationInterface {
    name = 'UserRole1663063450785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_globalrole_enum" AS ENUM('admin', 'editor', 'guest')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "globalRole" "public"."user_globalrole_enum" NOT NULL DEFAULT 'guest'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "globalRole"`);
        await queryRunner.query(`DROP TYPE "public"."user_globalrole_enum"`);
    }

}
