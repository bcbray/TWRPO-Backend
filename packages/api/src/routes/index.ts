import liveRouter from './live/index';

import v2CharactersRouter from './v2/characters';
import v2FactionsRouter from './v2/factions';
import v2FeedbackRouter from './v2/feedback';
import v2StreamersRouter from './v2/streamers';
import v2UnknownRouter from './v2/unknown';
import v2SegmentsRouter from './v2/segments';
import v2AdminOverrideSegmentRouter from './v2/admin/override-segment';
import v2AdminUsersRouter from './v2/admin/users';

export default {
    liveRouter,
    v2CharactersRouter,
    v2FactionsRouter,
    v2FeedbackRouter,
    v2StreamersRouter,
    v2UnknownRouter,
    v2SegmentsRouter,
    v2AdminOverrideSegmentRouter,
    v2AdminUsersRouter,
};
