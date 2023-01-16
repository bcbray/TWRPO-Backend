/* eslint-disable */
import { MigrationInterface, QueryRunner } from "typeorm"

export class TimeseriesIndex1673833926314 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE INDEX "IDX_stream_chunk_firstSeenDate" ON stream_chunk("firstSeenDate")`);
        queryRunner.query(`CREATE INDEX "IDX_stream_chunk_firstSeenDate_lastSeenDate" ON stream_chunk USING gist (tsrange("firstSeenDate","lastSeenDate"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP INDEX "IDX_stream_chunk_firstSeenDate"`);
        queryRunner.query(`DROP INDEX "IDX_stream_chunk_firstSeenDate_lastSeenDate"`);
    }

}
