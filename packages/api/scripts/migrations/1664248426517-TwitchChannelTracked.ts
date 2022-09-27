/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

export class TwitchChannelTracked1664248426517 implements MigrationInterface {
    name = 'TwitchChannelTracked1664248426517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitch_channel" ADD "isTracked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitch_channel" DROP COLUMN "isTracked"`);
    }

}
