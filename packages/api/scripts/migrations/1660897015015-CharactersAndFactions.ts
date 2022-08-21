/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CharactersAndFactions1660897015015 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS btree_gist
        `);

        await queryRunner.query(`
            CREATE TYPE nickname_type AS ENUM('character','faction')
        `);

        await queryRunner.query(`
            CREATE TABLE raw_character(
                id serial NOT NULL,
                name character varying NOT NULL,
                validity tsrange NOT NULL,
                streamer_id integer NOT NULL,
                sort_order integer NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_character_id_idx ON raw_character(id)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_character_validity_idx ON raw_character(validity)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_character ADD CONSTRAINT raw_character_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_character_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_character
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_character_timetravel_after
                AFTER UPDATE OR DELETE ON raw_character
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_faction_membership(
                character_id integer NOT NULL,
                faction_id integer NOT NULL,
                is_leader boolean NOT NULL DEFAULT false,
                rank_id integer,
                sort_order integer NOT NULL,
                validity tsrange NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_membership_character_id_faction_id_idx ON
                raw_faction_membership(character_id, faction_id)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_membership_character_id_idx ON
                raw_faction_membership(character_id)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_membership_faction_id_idx ON
                raw_faction_membership(faction_id)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction_membership
                ADD CONSTRAINT raw_faction_membership_no_overlap
                EXCLUDE USING gist (character_id WITH =, faction_id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_membership_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_faction_membership
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_membership_timetravel_after
                AFTER UPDATE OR DELETE ON raw_faction_membership
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_faction(
                id serial NOT NULL,
                key character varying NOT NULL,
                name character varying NOT NULL,
                light_color character varying,
                dark_color character varying,
                sort_order integer NOT NULL,
                validity tsrange NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_id_idx ON raw_faction(id)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_validity_idx ON raw_faction(validity)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction ADD CONSTRAINT raw_faction_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_timetravel_before
            BEFORE INSERT OR UPDATE OR DELETE ON raw_faction
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_timetravel_after
            AFTER UPDATE OR DELETE ON raw_faction
              FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_faction_rank(
                id integer NOT NULL,
                faction_id integer NOT NULL,
                name character varying NOT NULL,
                display_name character varying,
                validity tsrange NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_rank_id_idx ON raw_faction_rank(id);
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_rank_faction_id_idx ON raw_faction_rank
            (faction_id)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_faction_rank_validity_idx ON raw_faction_rank(validity)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction_rank ADD CONSTRAINT raw_faction_rank_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_rank_timetravel_before
            BEFORE INSERT OR UPDATE OR DELETE ON raw_faction
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_faction_rank_timetravel_after
            AFTER UPDATE OR DELETE ON raw_faction
              FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_nickname(
                id serial NOT NULL,
                foreign_id integer NOT NULL,
                foreign_type nickname_type NOT NULL,
                nickname character varying NOT NULL,
                validity tsrange NOT NULL DEFAULT '[,]'
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_nickname_foreign_id_foreign_type_idx ON raw_nickname
                (foreign_id, foreign_type)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_nickname_validity_idx ON raw_nickname(validity)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_nickname_id_idx ON raw_nickname(id)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_nickname ADD CONSTRAINT raw_nickname_no_overlap
                EXCLUDE USING gist (id WITH =, nickname WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_nickname_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_nickname
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_nickname_timetravel_after
                AFTER UPDATE OR DELETE ON raw_nickname
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_regex(
                id serial NOT NULL,
                foreign_id integer NOT NULL,
                foreign_type nickname_type NOT NULL,
                regex character varying NOT NULL,
                no_former boolean NOT NULL DEFAULT false,
                no_later boolean NOT NULL DEFAULT false,
                validity tsrange NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_regex_foreign_id_foreign_type_idx ON raw_regex
                (foreign_id, foreign_type)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_regex_validity_idx ON raw_regex(validity)
        `);

        await queryRunner.query(`
            CREATE INDEX raw_regex_id_idx ON raw_regex(id)
        `);

        await queryRunner.query(`
            ALTER TABLE raw_regex ADD CONSTRAINT raw_regex_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_regex_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_regex
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_regex_timetravel_after
                AFTER UPDATE OR DELETE ON raw_regex
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                ADD COLUMN streamer_id SERIAL NOT NULL;
        `);

        await queryRunner.query(`
            CREATE VIEW nickname AS
                SELECT id, foreign_id, foreign_type, nickname FROM raw_nickname
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW regex AS
                SELECT id, foreign_id, foreign_type, regex, no_former, no_later FROM raw_regex
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW character AS
                SELECT id, name, streamer_id, sort_order FROM raw_character
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW faction AS
                SELECT id, key, name, light_color, dark_color, sort_order FROM raw_faction
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW character_with_nicknames AS
                SELECT
                    character.id,
                    character.name,
                    nn.nicknames,
                    rx.regexes,
                    streamer_id,
                    sort_order
                FROM character
                LEFT JOIN (
                    SELECT
                        nickname.foreign_id AS id,
                        array_agg(nickname.nickname) as nicknames
                    FROM nickname
                    WHERE nickname.foreign_type = 'character'
                    GROUP BY nickname.foreign_id
                ) nn USING (id)
                LEFT JOIN (
                    SELECT
                        regex.foreign_id AS id,
                        array_agg(
                            json_build_object(
                                'regex', regex.regex,
                                'no_former', regex.no_former,
                                'no_later', regex.no_later
                            )
                        ) as regexes
                    FROM regex
                    WHERE regex.foreign_type = 'character'
                    GROUP BY regex.foreign_id
                ) rx USING (id);
        `);

        await queryRunner.query(`
            CREATE VIEW faction_with_nicknames AS
                SELECT
                    faction.id,
                    faction.name,
                    nn.nicknames,
                    rx.regexes,
                    sort_order
                FROM faction
                LEFT JOIN (
                    SELECT
                        nickname.foreign_id AS id,
                        array_agg(nickname.nickname) as nicknames
                    FROM nickname
                    WHERE nickname.foreign_type = 'faction'
                    GROUP BY nickname.foreign_id
                ) nn USING (id)
                LEFT JOIN (
                    SELECT
                        regex.foreign_id AS id,
                        array_agg(
                            json_build_object(
                                'regex', regex.regex,
                                'no_former', regex.no_former,
                                'no_later', regex.no_later
                            )
                        ) as regexes
                    FROM regex
                    WHERE regex.foreign_type = 'faction'
                    GROUP BY regex.foreign_id
                ) rx USING (id);
        `);

        await queryRunner.query(`
            CREATE VIEW faction_membership AS
                SELECT character_id, faction_id, is_leader, rank_id, sort_order FROM raw_faction_membership
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW faction_rank AS
                SELECT id, faction_id, name, display_name FROM raw_faction_rank
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW faction_membership_with_rank AS
                SELECT
                    character_id,
                    faction_id,
                    is_leader,
                    rank.name AS rank_name,
                    rank.display_name AS rank_display_name
                FROM faction_membership
                LEFT JOIN (
                    SELECT
                        faction_rank.id AS rank_id,
                        faction_rank.name,
                        faction_rank.display_name
                    FROM faction_rank
                ) rank USING (rank_id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW faction_membership_with_rank
        `);

        await queryRunner.query(`
            DROP VIEW character_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW faction_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW faction_rank
        `);

        await queryRunner.query(`
            DROP VIEW faction_membership
        `);

        await queryRunner.query(`
            DROP VIEW regex
        `);

        await queryRunner.query(`
            DROP VIEW nickname
        `);

        await queryRunner.query(`
            DROP VIEW character
        `);

        await queryRunner.query(`
            DROP VIEW faction
        `);

        await queryRunner.query(`
            ALTER TABLE twitch_channel
                DROP COLUMN streamer_id
        `);

        await queryRunner.query(`
            DROP TABLE raw_character
        `);

        await queryRunner.query(`
            DROP TABLE raw_faction_membership
        `);

        await queryRunner.query(`
            DROP TABLE raw_faction
        `);

        await queryRunner.query(`
            DROP TABLE raw_nickname
        `);

        await queryRunner.query(`
            DROP TABLE raw_regex
        `);

        await queryRunner.query(`
            DROP TABLE raw_faction_rank
        `);

        await queryRunner.query(`
            DROP TYPE nickname_type
        `);
    }
}
