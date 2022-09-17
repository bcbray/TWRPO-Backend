/* eslint-disable */

import { MigrationInterface, QueryRunner } from "typeorm";

const regWrp = /(?<!\bnot\b\s+)(?:wild\s*rp|\bwrp\b)(?![\s\-]*(?:inspired|based|like|ban|\.ins\b))/i;

const regOthers = [
    { name: 'Sundance RP', reg: /\bsd\s*rp|sundance\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Sundown RP', reg: /\bsundown\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'NewCenturyRP', reg: /\bnc\s*rp|\bnew\s*century\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'New Valley RP', reg: /\bnew\s*valley\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Wild West RP', reg: /\bww\s*rp|\bwild\s*west\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Syn County RP', reg: /\bsyn\s*rp|\bsyn\s*county\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Hollow Creek RP', reg: /\bhc\s*rp|\bhollow\s*creek\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Haven\'s Crest RP', reg: /\bhaven'?s\s+crest\s+(?:rp\b|roleplay)/i, include: 1 },
    { name: 'PRC', reg: /\bprc\b/i, include: 1 },
    { name: 'Calico County RP', reg: /\bcalico\s*county\s*(?:rp\b|roleplay)/i, include: 1 },
    { name: 'Red Dead Online', reg: /\b(?:rdr[\s:-]*[2]?|read\s*dead)[\s:-]*online/i, include: 0 },
    { name: 'RDR Story', reg: /\bstory[\s\-]*mode\b|\bsingle[\s\-]*player\b|\b(?:rdr|red\s+dead\s+redemption)[\s:-]*[2]?[\s\-]+(?:story|campaign)|playthrough/i, include: 0 },
];

export class Server1663372521826 implements MigrationInterface {
    name = 'Server1663372521826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "server_regex" ("id" SERIAL NOT NULL, "regex" character varying NOT NULL, "isCaseSensitive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "serverId" integer NOT NULL, CONSTRAINT "PK_d824deb0ec90c90ad3f5077d00e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "server" ("id" SERIAL NOT NULL, "key" character varying, "name" character varying NOT NULL, "isVisible" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "sortOrder" integer, CONSTRAINT "PK_f8b8af38bdc23b447c0a57c7937" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97a9330d3cd2d89f623762a202" ON "server" ("key") `);
        await queryRunner.query(`ALTER TABLE "server_regex" ADD CONSTRAINT "FK_10fa88c0d20f30d2da4707f1544" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        queryRunner.query(`
            INSERT INTO "server" ("key", "name", "isVisible", "sortOrder")
                VALUES ('wrp', 'Wild RP', true, 0);
        `);

        queryRunner.query(`
            INSERT INTO "server_regex" ("regex", "isCaseSensitive", "serverId")
                VALUES (
                    $1,
                    $2,
                    (SELECT "id" FROM "server" WHERE "key" = 'wrp')
                );
        `, [ regWrp.source, !regWrp.flags.includes('i') ]);

        for (const other of regOthers) {
            queryRunner.query(`
                WITH s AS (
                    INSERT INTO "server" ("name", "isVisible")
                    VALUES ($1, $2)
                    RETURNING *
                )
                INSERT INTO "server_regex" ("regex", "isCaseSensitive", "serverId")
                SELECT $3, $4, id FROM s;
            `, [
                other.name,
                other.include === 1,
                other.reg.source,
                !other.reg.flags.includes('i'),
            ]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "server_regex" DROP CONSTRAINT "FK_10fa88c0d20f30d2da4707f1544"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97a9330d3cd2d89f623762a202"`);
        await queryRunner.query(`DROP TABLE "server"`);
        await queryRunner.query(`DROP TABLE "server_regex"`);
    }

}
