/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTimetravel1660896659642 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adapted from: https://blog.myitcv.io/2014/02/25/row-level-version-control-with-postgresql.html

        /*
        Copyright (c) 2015 Paul Jolly <paul@myitcv.org.uk)
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
        */

        await queryRunner.query(`
            CREATE FUNCTION process_timetravel_before() RETURNS TRIGGER AS $timetravel_before$
            DECLARE
              temp_row RECORD; -- a temporary variable used on updates/deletes
              time_now TIMESTAMP WITHOUT TIME ZONE; -- get the time now just once.... for consistency's sake
            BEGIN
              time_now = now();

              IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN

                -- the user should not be able to update historic rows
                IF NOT (OLD.validity @> 'infinity'::timestamp without time zone) THEN
                  RAISE EXCEPTION 'Cannot % old row', TG_OP;
                END IF;

                -- use of TG_TABLE_NAME keeps this generic and non-table specific
                -- see http://www.postgresql.org/docs/9.3/static/plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN
                EXECUTE 'SELECT * FROM ' || TG_TABLE_NAME::regclass || ' WHERE ctid = $1 FOR UPDATE' USING OLD.ctid;

                -- not sure whether this is strictly required... could we modify OLD without side effects?
                temp_row := OLD;
                temp_row.validity = tsrange(lower(temp_row.validity),null);

                IF (TG_OP = 'UPDATE') THEN

                  -- 'bump' the validity
                  NEW.validity = tsrange(time_now, null);

                  -- allow the update to continue... so that the correct number of rows are reported
                  -- as having been affected
                  RETURN NEW;

                ELSIF (TG_OP = 'DELETE') THEN

                  -- we want to allow the delete to continue... so that the correct number of rows are reported
                  -- as having been affected
                  RETURN OLD;

                END IF;

                RETURN NULL; -- shouldn't ever get here

              ELSIF (TG_OP = 'INSERT' AND NEW.validity IS null) THEN

                -- this case could well be avoided by having a table definition with defaults:
                --   validity = [now(), 'infinity')
                --
                -- but we include this as a safety net
                NEW.validity := tsrange(time_now, null);

                -- allow the insert to continue... so that the correct number of rows are reported
                -- as having been affected
                RETURN NEW;

              ELSIF (TG_OP = 'INSERT') THEN

                -- allow the insert to continue... so that the correct number of rows are reported
                -- as having been affected
                RETURN NEW;

              END IF;

              RETURN NULL; -- won't get here if we only create the trigger for insert, update and delete

            END;
            $timetravel_before$ LANGUAGE plpgsql;
        `)

        await queryRunner.query(`
            CREATE FUNCTION process_timetravel_after() RETURNS TRIGGER AS $timetravel_after$
            DECLARE
              temp_row RECORD; -- a temporary variable used on updates/deletes
              time_now TIMESTAMP WITHOUT TIME ZONE; -- get the time now just once.... for consistency's sake
            BEGIN
              time_now = now();

              IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN

                -- not sure whether this is strictly required... could we modify OLD without side effects?
                temp_row := OLD;
                IF (TG_OP = 'UPDATE') THEN
                  temp_row.validity := tsrange(lower(temp_row.validity), lower(NEW.validity));
                ELSIF (TG_OP = 'DELETE') THEN
                  temp_row.validity := tsrange(lower(temp_row.validity), time_now);
                END IF;

                -- again, use of TG_TABLE_NAME keeps this generic and non-table specific
                EXECUTE 'INSERT INTO  ' || TG_TABLE_NAME::regclass || ' SELECT $1.*' USING temp_row;

              END IF;

              RETURN NULL; -- return value doesn't matter in after

            END;
            $timetravel_after$ LANGUAGE plpgsql;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION process_timetravel_before;`);
        await queryRunner.query(`DROP FUNCTION process_timetravel_after;`);
    }

}
