import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';

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

app.get('/test', (req, res) => {
    log('/test');
    return res.send('test');
});

app.use('/tno_data', routes.tnoDataRouter);
app.use('/initial_data', routes.tnoDataRouter);
app.use('/data', routes.dataRouter);
app.use('/streams', routes.streamsRouter);
app.use('/live', routes.liveRouter);

app.get('/', (req, res) => {
    return res.redirect('https://chrome.google.com/webstore/detail/twitch-wildrp-only/jnbgafpjnfoocapahlkjihjecoaaaikd');
});

app.use((_req, res) => res.status(404).send({ error: 'This is not a valid API endpoint.' }));

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    log(`HTTP server running on port ${port}!`);
});
