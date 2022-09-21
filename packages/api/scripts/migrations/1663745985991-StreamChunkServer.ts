/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkServer1663745985991 implements MigrationInterface {
    name = 'StreamChunkServer1663745985991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD "serverId" integer`);
        await queryRunner.query(`UPDATE stream_chunk SET "serverId" = server.id FROM server WHERE server.key = 'wrp'`);
        await queryRunner.query(`ALTER TABLE "stream_chunk" ALTER COLUMN "serverId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stream_chunk" ADD CONSTRAINT "FK_7876f5228a43f62f9ddc60be296" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP CONSTRAINT "FK_7876f5228a43f62f9ddc60be296"`);
        await queryRunner.query(`ALTER TABLE "stream_chunk" DROP COLUMN "serverId"`);
    }

}
