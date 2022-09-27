/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class StreamChunkNullableServer1664271038075 implements MigrationInterface {
    name = 'StreamChunkNullableServer1664271038075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ALTER COLUMN "serverId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stream_chunk" ALTER COLUMN "serverId" SET NOT NULL`);
    }

}
