import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';

import { log } from './utils';
import routes from './routes';

const { HTTP_PORT, HTTPS_PORT } = process.env;

const isProd = process.env.ENV !== 'DEV';

const app = express();

app.enable('trust proxy');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (!isProd || req.secure) {
        next();
    } else {
        const newUrl = `https://${req.headers.host?.replace(`:${HTTP_PORT}`, `:${HTTPS_PORT}`)}${req.url}`;
        res.redirect(newUrl);
    }
});

app.get('/test', (_, res) => {
    log('/test');
    return res.send('test');
});

// TODO: Old extension's routes, should remove completely
// app.use('/tno_data', routes.tnoDataRouter);
// app.use('/initial_data', routes.tnoDataRouter);
// app.use('/data', routes.dataRouter);
// app.use('/streams', routes.streamsRouter);
app.use('/live', routes.liveRouter);

app.use('/api/v1/live', routes.liveRouter);
app.use('/api/v2/characters', routes.v2CharactersRouter);
app.use('/api/v2/submit-feedback', routes.v2FeedbackRouter);

app.use(express.static(path.resolve('frontend', 'build')));

app.get('*', (_, res) => res.sendFile(path.resolve('frontend', 'build', 'index.html')));

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    log(`HTTP server running on port ${port}!`);
});
