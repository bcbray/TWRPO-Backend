import { Server } from '../db/entity/Server';

export interface ParsedServer extends Omit<Server, 'regexes'> {
    regexes: RegExp[];
}

export const parseServer = (server: Server): ParsedServer => {
    const { regexes: dbRegexes, ...rest } = server;
    const regexes: RegExp[] = [];
    for (const dbRegex of dbRegexes) {
        try {
            regexes.push(new RegExp(dbRegex.regex, dbRegex.isCaseSensitive ? undefined : 'i'));
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error(JSON.stringify({
                    level: 'error',
                    message: 'Failed construct regex for server',
                    server,
                    regex: dbRegex,
                    error,
                }));
            } else {
                throw error;
            }
        }
    }
    return {
        regexes,
        ...rest,
    };
};
