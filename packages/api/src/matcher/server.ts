import { Server } from '../db/entity/Server';
import { Logger } from '../logger';

export interface ParsedServer extends Omit<Server, 'regexes'> {
    regexes: RegExp[];
}

export const parseServer = (logger: Logger) => (server: Server): ParsedServer => {
    const { regexes: dbRegexes, ...rest } = server;
    const regexes: RegExp[] = [];
    for (const dbRegex of dbRegexes) {
        try {
            regexes.push(new RegExp(dbRegex.regex, dbRegex.isCaseSensitive ? undefined : 'i'));
        } catch (error) {
            if (error instanceof SyntaxError) {
                logger.error('Failed construct regex for server', {
                    server,
                    regex: dbRegex,
                    error,
                });
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

export const matchServer = (title: string, servers: ParsedServer[]): ParsedServer | null => {
    let matchPos = Number.POSITIVE_INFINITY;
    let matchedServer: ParsedServer | null = null;

    for (const server of servers) {
        for (const otherRegex of server.regexes) {
            const thisPos = title.indexOfRegex(otherRegex);
            if (thisPos > -1 && thisPos < matchPos) {
                matchedServer = server;
                matchPos = thisPos;
            }
        }
    }
    return matchedServer;
};
