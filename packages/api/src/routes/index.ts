import liveRouter from './live/index';

import v2CharactersRouter from './v2/characters';
import v2FactionsRouter from './v2/factions';
import v2FeedbackRouter from './v2/feedback';
import v2StreamersRouter from './v2/streamers';
import v2UnknownRouter from './v2/unknown';
import v2SegmentsRouter from './v2/segments';
import v2WhoamiRouter from './v2/whoami';
import v2StreamsRouter from './v2/streams';
import v2ServersRouter from './v2/servers';
import v2UsersRouter from './v2/users';
import v2TimeseriesRouter from './v2/timeseries';
import v2AdminOverrideSegmentRouter from './v2/admin/override-segment';
import v2AdminReorderServersRouter from './v2/admin/reorder-servers';
import v2AdminTestMatcherRouter from './v2/admin/test-matcher';
import v2AdminOverrideMultipleSegmentsRouter from './v2/admin/override-multiple-segments';

export default {
    liveRouter,
    v2CharactersRouter,
    v2FactionsRouter,
    v2FeedbackRouter,
    v2StreamersRouter,
    v2UnknownRouter,
    v2SegmentsRouter,
    v2WhoamiRouter,
    v2StreamsRouter,
    v2ServersRouter,
    v2UsersRouter,
    v2TimeseriesRouter,
    v2AdminOverrideSegmentRouter,
    v2AdminReorderServersRouter,
    v2AdminTestMatcherRouter,
    v2AdminOverrideMultipleSegmentsRouter,
};
