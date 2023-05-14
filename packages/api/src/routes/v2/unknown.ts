import { Router } from 'express';
import { ApiClient } from '@twurple/api';
import { DataSource, IsNull, Not } from 'typeorm';
import { UnknownResponse, SegmentAndStreamer, UserResponse } from '@twrpo/types';

import { getFilteredWrpLive } from '../live/liveData';
import { fetchCharacters } from './characters';
import { StreamChunk } from '../../db/entity/StreamChunk';
import { videoUrlOffset } from '../../utils';
import { isEditorForTwitchId } from '../../userUtils';
import { fetchSessionUser } from './whoami';
import { SessionUser } from '../../SessionUser';
import { chunkIsShorterThanMinimum, chunkIsRecent } from '../../segmentUtils';
import { Logger } from '../../logger';

export const fetchUnknown = async (apiClient: ApiClient, dataSource: DataSource, logger: Logger, userResponse: UserResponse): Promise<UnknownResponse> => {
    const liveData = await getFilteredWrpLive(apiClient, dataSource, logger, userResponse);
    const liveDataLookup = Object.fromEntries(liveData.streams
        .filter(s => s.segmentId)
        .map(s => [s.segmentId!, s]));

    const characters = await fetchCharacters(apiClient, dataSource, logger, {}, userResponse);
    const characterLookup = Object.fromEntries(
        characters.characters.map(c => [c.id, c])
    );
    const unknownSegments = await dataSource.getRepository(StreamChunk)
        .find({
            where: {
                characterId: IsNull(),
                server: { key: 'wrp' },
            },
            order: { lastSeenDate: 'desc' },
            take: 24,
            relations: {
                video: true,
                channel: true,
                server: true,
                game: true,
            },
        });
    const uncertainSegments = await dataSource.getRepository(StreamChunk)
        .find({
            where: {
                characterId: Not(IsNull()),
                characterUncertain: true,
            },
            order: { lastSeenDate: 'desc' },
            take: 24,
            relations: {
                video: true,
                channel: true,
                server: true,
                game: true,
            },
        });
    const segmentAndStreamer = (segment: StreamChunk): SegmentAndStreamer => {
        const url = segment.video
            ? videoUrlOffset(segment.video.url, segment.streamStartDate, segment.firstSeenDate)
            : undefined;
        return {
            streamer: {
                twitchId: segment.channel!.twitchId,
                twitchLogin: segment.channel!.twitchLogin,
                displayName: segment.channel!.displayName,
                profilePhotoUrl: segment.channel!.profilePhotoUrl,
            },
            segment: {
                id: segment.id,
                title: segment.title,
                url,
                thumbnailUrl: segment.video?.thumbnailUrl,
                startDate: segment.firstSeenDate.toISOString(),
                endDate: segment.lastSeenDate.toISOString(),
                streamStartDate: segment.streamStartDate.toISOString(),
                character: segment.characterId ? characterLookup[segment.characterId] : null,
                characterUncertain: segment.characterUncertain,
                liveInfo: liveDataLookup[segment.id],
                streamId: segment.streamId,
                isHidden: segment.isHidden,
                isTooShort: chunkIsShorterThanMinimum(segment) && !chunkIsRecent(segment),
                server: segment.server ? {
                    id: segment.server.id,
                    key: segment.server.key ?? undefined,
                    name: segment.server.name,
                    tagName: segment.server.tagName,
                    isVisible: segment.server.isVisible,
                    isRoleplay: segment.server.isRoleplay,
                } : undefined,
                serverUncertain: segment.serverUncertain,
                game: {
                    id: segment.game!.id,
                    key: segment.game!.key ?? undefined,
                    name: segment.game!.name,
                },
            },
        };
    };

    return {
        unknown: unknownSegments
            .filter(s => s.channel && s.game)
            .map(segmentAndStreamer)
            .filter(({ streamer, segment }) => (!segment.isHidden && !segment.isTooShort) || isEditorForTwitchId(streamer.twitchId, userResponse)),
        uncertain: uncertainSegments
            .filter(s => s.channel && s.game)
            .map(segmentAndStreamer)
            .filter(({ streamer, segment }) => (!segment.isHidden && !segment.isTooShort) || isEditorForTwitchId(streamer.twitchId, userResponse)),
    };
};

const buildRouter = (apiClient: ApiClient, dataSource: DataSource, logger: Logger): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const userResponse = await fetchSessionUser(dataSource, req.user as SessionUser | undefined);
        const response = await fetchUnknown(apiClient, dataSource, logger, userResponse);
        return res.send(response);
    });

    return router;
};

export default buildRouter;
