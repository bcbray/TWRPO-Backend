/* eslint-disable class-methods-use-this */

import { MigrationInterface, QueryRunner } from 'typeorm';

import { cloneDeepJson } from '../../src/utils';
import { wrpCharacters as wrpCharactersOld } from '../../src/data/characters';
import type { Character as CharacterOld, WrpCharacters as WrpCharactersOld } from '../../src/data/characters';

// Hoo boy. So, I messed up and wrote a bug that tagged a lot of stream chunks
// as uncertain (basically inverting them). Then I fixed that, but it meant that
// incorrect data was mixed in with correct data.
//
// To fix, we'll re-do a little bit of the title matching that happens in
// liveData. We'll ignore much of it, because the identified character we have
// stored is doing the heavy lifting. We just need to check titles against that
// character's regex. (We ignore a few things like assumeChar needing to defer
// to explicit faction mentions because none of the streamers live during the
// time when incorrect data was being generated have an assumeChar).
//
// Note to self: test things. Also build a way to re-match stream segments after
// the fact and review the changes without a hacky one-off migration.

interface Character extends CharacterOld {
    nameReg: RegExp;
}
type WrpCharacter = Character[];
type WrpCharacters = { [key: string]: WrpCharacter };
const wrpCharacters = cloneDeepJson<WrpCharactersOld, WrpCharacters>(wrpCharactersOld);

/// Parse characters (just the bits we need, copied from liveData. Forgive me.)

for (const [streamer, characters] of Object.entries(wrpCharacters)) {
    const streamerLower = streamer.toLowerCase();

    // eslint-disable-next-line no-loop-func
    characters.forEach((char) => {
        const charOld = char as unknown as CharacterOld;
        const names = charOld.name.split(/\s+/);
        const nameRegAll = [];
        const parsedNames = [];
        const titles = [];
        const realNames = [];
        let currentName = null;
        const displayNameNum = charOld.displayName;

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            let pushName;
            if (currentName != null) {
                currentName.push(name);
                if (name.includes(']') || name.includes('"')) {
                    pushName = currentName.join(' ');
                    const type1 = pushName.includes('[');
                    pushName = pushName.replace(/[\[\]"]/g, '');
                    if (type1) {
                        titles.push(pushName);
                    }
                    currentName = null;
                }
            } else if (name.includes('[') || name.includes('"')) {
                const type1 = name.includes('[');
                if ((type1 && name.includes(']')) || (!type1 && name.indexOf('"') !== name.lastIndexOf('"'))) {
                    pushName = name.replace(/[\[\]"]/g, '');
                    if (type1) {
                        titles.push(pushName);
                    }
                } else {
                    currentName = [name];
                }
            } else {
                pushName = name.replace(/"/g, '');
                realNames.push(pushName.replace(/\./g, ''));
            }
            if (pushName) parsedNames.push(RegExp.escape(pushName.toLowerCase()));
        }

        if (charOld.nicknames) {
            if (realNames.length === 1) realNames.push(realNames[0]);
            if (displayNameNum !== 0) realNames.push(...charOld.nicknames.filter(nck => typeof nck === 'string'));
            charOld.nicknames.forEach((nck) => {
                if (nck[0] === '/' && nck[nck.length - 1] === '/') {
                    nameRegAll.push(nck.substring(1, nck.length - 1));
                } else {
                    const nicknameKeywords = [...nck.matchAll(/"([^"]+)"/g)].map(result => result[1]);
                    if (nicknameKeywords.length > 0) {
                        parsedNames.push(...nicknameKeywords.map(keyword => RegExp.escape(keyword.toLowerCase())));
                    } else {
                        parsedNames.push(RegExp.escape(nck.toLowerCase()));
                    }
                }
            });
        }

        nameRegAll.push(`\\b(?:${parsedNames.join('|')})\\b`);
        char.nameReg = new RegExp(nameRegAll.join('|'), nameRegAll.length > 1 ? 'ig' : 'g');
    });

    if (streamer !== streamerLower) {
        wrpCharacters[streamerLower] = characters;
        delete wrpCharacters[streamer];
    }
}

export class FixUncertainCharacters1660563350573 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        interface Result {
            chunkId: number;
            characterId: number;
            uncertain: boolean;
            title: string;
            twitchId: string;
            twitchLogin: string;
            channelName: string;
        }

        const results = await queryRunner.query(`
            SELECT
                "stream_chunk"."id" AS "chunkId",
                "stream_chunk"."characterId" AS "characterId",
                "stream_chunk"."characterUncertain" AS "uncertain",
                "stream_chunk"."title" AS "title",
                "twitch_channel"."twitchId" AS "twitchId",
                "twitch_channel"."twitchLogin" AS "twitchLogin",
                "twitch_channel"."displayName" AS "channelName"
            FROM "stream_chunk"
            JOIN "twitch_channel"
                ON "stream_chunk"."streamerId" = "twitch_channel"."twitchId"
            WHERE "characterId" IS NOT NULL
            AND "lastSeenDate" > '2022-08-14T07:00:00Z'
        `) as Result[];

        interface Update {
            chunkId: number;
            uncertain: boolean;
        }

        const updates: Update[] = [];

        for (const result of results) {
            const titleParsed = result.title.toLowerCase().replace(/\./g, ' ');
            const channelNameLower = result.channelName.toLowerCase();
            const characters = wrpCharacters[channelNameLower] as WrpCharacter | undefined;
            const character = characters?.find(c => c.id === result.characterId);
            if (!character) {
                console.warn(JSON.stringify({
                    level: 'warning',
                    message: `Could not find character id ${result.characterId} for ${result.channelName} (${result.twitchId})`,
                }));
                continue;
            }

            const matchPositions = [...titleParsed.matchAll(character.nameReg)];

            const newUncertain = matchPositions.length === 0;

            if (newUncertain !== result.uncertain) {
                updates.push({
                    chunkId: result.chunkId,
                    uncertain: newUncertain,
                });
            }
        }

        if (updates.length) {
            await queryRunner.query(`
                CREATE TABLE stream_chunk_1660563350573_uncertain_updated AS
                SELECT * FROM "stream_chunk"
                WHERE "id" IN (${updates.map(u => u.chunkId.toString()).join(', ')})
            `);

            await queryRunner.query(`
                UPDATE "stream_chunk" SET
                    "characterUncertain" = "update"."uncertain"
                FROM (values
                    ${updates.map(u => (
        `(${u.chunkId}, ${u.uncertain})`
    )).join(',\n                ')}
                ) AS "update"("chunk_id", "uncertain")
                WHERE "stream_chunk"."id" = "update"."chunk_id";
            `);

            console.log(JSON.stringify({
                level: 'info',
                message: `Fixed uncertainty for ${updates.length} stream segments`,
            }));
        } else {
            console.log(JSON.stringify({
                level: 'info',
                message: 'No incorrect uncertainty to fix',
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove rows that are present in the backup (they were consolidated in the migration)
        await queryRunner.query(`
            DELETE FROM "stream_chunk"
            WHERE "id" IN
            (SELECT "id" FROM "stream_chunk_1660563350573_uncertain_updated");
        `);

        // Pull data from the backup
        const hasRemoved = await queryRunner.hasTable('stream_chunk_1660563350573_uncertain_updated');
        if (hasRemoved) {
            await queryRunner.query(`
                INSERT INTO "stream_chunk" (
                    "id",
                    "streamerId",
                    "characterId",
                    "characterUncertain",
                    "streamId",
                    "streamStartDate",
                    "title",
                    "firstSeenDate",
                    "lastSeenDate"
                )
                SELECT
                    "id",
                    "streamerId",
                    "characterId",
                    "characterUncertain",
                    "streamId",
                    "streamStartDate",
                    "title",
                    "firstSeenDate",
                    "lastSeenDate"
                FROM "stream_chunk_1660563350573_uncertain_updated";
            `);
        }

        // Remove the backup
        await queryRunner.query(`
            DROP TABLE "stream_chunk_1660563350573_uncertain_updated";
        `);
    }
}
