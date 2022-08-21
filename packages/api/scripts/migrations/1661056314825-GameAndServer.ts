/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameAndServer1661056314825 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE raw_game(
                id serial NOT NULL,
                "key" character varying NOT NULL,
                "name" character varying NOT NULL,
                twitch_id character varying NOT NULL,
                sort_order integer NOT NULL,
                validity tsrange NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE INDEX raw_game_validity_idx ON raw_game(validity);
        `);

        await queryRunner.query(`
            CREATE INDEX raw_game_id_idx ON raw_game(id);
        `);

        await queryRunner.query(`
            ALTER TABLE raw_game
                ADD CONSTRAINT raw_game_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_game_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_game
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_game_timetravel_after
                AFTER UPDATE OR DELETE ON raw_game
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE TABLE raw_server(
                id serial NOT NULL,
                key character varying NOT NULL,
                name character varying NOT NULL,
                game_id integer NOT NULL,
                sort_order integer NOT NULL,
                validity tsrange NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE INDEX raw_server_validity_idx ON raw_server(validity);
        `);

        await queryRunner.query(`
            CREATE INDEX raw_server_id_idx ON raw_server(id);
        `);

        await queryRunner.query(`
            ALTER TABLE raw_server
                ADD CONSTRAINT raw_server_no_overlap
                EXCLUDE USING gist (id WITH =, validity WITH &&)
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_server_timetravel_before
                BEFORE INSERT OR UPDATE OR DELETE ON raw_server
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_before()
        `);

        await queryRunner.query(`
            CREATE TRIGGER raw_server_timetravel_after
                AFTER UPDATE OR DELETE ON raw_server
                FOR EACH ROW EXECUTE PROCEDURE process_timetravel_after()
        `);

        await queryRunner.query(`
            CREATE VIEW game AS
                SELECT id, key, name, twitch_id, sort_order FROM raw_game
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE;
        `);

        await queryRunner.query(`
            CREATE VIEW server AS
                SELECT id, key, name, game_id, sort_order FROM raw_server
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE;
        `);

        await queryRunner.query(`
            CREATE VIEW server_with_nicknames AS
                SELECT
                    server.id,
                    server.key,
                    server.name,
                    server.game_id,
                    nn.nicknames,
                    rx.regexes,
                    sort_order
                FROM server
                LEFT JOIN (
                    SELECT
                        nickname.foreign_id AS id,
                        array_agg(nickname.nickname) as nicknames
                    FROM nickname
                    WHERE nickname.foreign_type = 'server'
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
                    WHERE regex.foreign_type = 'server'
                    GROUP BY regex.foreign_id
                ) rx USING (id);
        `);

        const insertedGame: { id: number }[] = await queryRunner.query(`
            INSERT INTO game (key, name, twitch_id, sort_order)
                VALUES ('rdr2', 'Red Dead Redemption 2', '493959', 0)
                RETURNING id;
        `);
        const gameId = insertedGame[0].id;

        const insertedServer: { id: number }[] = await queryRunner.query(`
            INSERT INTO server (key, name, game_id, sort_order)
                VALUES ('wrp', 'Wild RP', $1, 0)
                RETURNING id;
        `, [gameId]);
        const serverId = insertedServer[0].id;

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ADD COLUMN server_id integer NOT NULL DEFAULT ${serverId}
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ALTER COLUMN server_id DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ADD COLUMN game_id integer NOT NULL DEFAULT ${gameId}
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                ALTER COLUMN game_id DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE raw_character
                ADD COLUMN server_id integer NOT NULL DEFAULT ${serverId}
        `);

        await queryRunner.query(`
            ALTER TABLE raw_character
                ALTER COLUMN server_id DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction
                ADD COLUMN server_id integer NOT NULL DEFAULT ${serverId}
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction
                ALTER COLUMN server_id DROP DEFAULT
        `);

        await queryRunner.query(`
            DROP VIEW faction_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW character_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW faction
        `);

        await queryRunner.query(`
            DROP VIEW character
        `);

        await queryRunner.query(`
            CREATE VIEW character AS
                SELECT id, name, streamer_id, server_id, sort_order FROM raw_character
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW faction AS
                SELECT id, key, name, light_color, dark_color, server_id, sort_order FROM raw_faction
                    WHERE validity @> 'infinity'::TIMESTAMP WITHOUT TIME ZONE
        `);

        await queryRunner.query(`
            CREATE VIEW character_with_nicknames AS
                SELECT
                    character.id,
                    character.name,
                    nn.nicknames,
                    rx.regexes,
                    fs.faction_ids,
                    streamer_id,
                    server_id,
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
                ) rx USING (id)
                LEFT JOIN (
                    SELECT
                        faction_membership.character_id AS id,
                        array_agg(faction_membership.faction_id) as faction_ids
                    FROM faction_membership
                    GROUP BY faction_membership.character_id
                ) fs USING (id)
        `);

        await queryRunner.query(`
            CREATE VIEW faction_with_nicknames AS
                SELECT
                    faction.id,
                    faction.key,
                    faction.name,
                    faction.light_color,
                    faction.dark_color,
                    nn.nicknames,
                    rx.regexes,
                    server_id,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW faction_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW character_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW faction
        `);

        await queryRunner.query(`
            DROP VIEW character
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
            ALTER TABLE stream_segment
                DROP COLUMN server_id
        `);

        await queryRunner.query(`
            ALTER TABLE stream_segment
                DROP COLUMN game_id
        `);

        await queryRunner.query(`
            ALTER TABLE raw_character
                DROP COLUMN server_id
        `);

        await queryRunner.query(`
            ALTER TABLE raw_faction
                DROP COLUMN server_id
        `);

        await queryRunner.query(`
            DROP VIEW server_with_nicknames
        `);

        await queryRunner.query(`
            DROP VIEW game
        `);

        await queryRunner.query(`
            DROP VIEW server
        `);

        await queryRunner.query(`
            DROP TABLE raw_game
        `);

        await queryRunner.query(`
            DROP TABLE raw_server
        `);
    }
}
