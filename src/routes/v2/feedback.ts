import { Router, Request } from 'express';
import axios from 'axios';
import parseurl from 'parseurl';
import markdownEscape from 'markdown-escape';

const router = Router();

interface Feedback {
    suggestion: string;
    email?: string;
    discord?: string;
    page?: string;
}

interface WebhookMessage {
    content: string;
    username?: string;
}

router.post('/', async (req: Request<any, any, Feedback>, res) => {
    const webhookID = process.env.SUGGESTION_DISCORD_WEBHOOK_ID;
    if (!webhookID) {
        console.error('Missing SUGGESTION_DISCORD_WEBHOOK_ID');
        return res.status(500).send({ success: false, errors: [{ message: 'Unable to forward feedback' }] });
    }
    const webhookToken = process.env.SUGGESTION_DISCORD_WEBHOOK_TOKEN;
    if (!webhookToken) {
        console.error('Missing SUGGESTION_DISCORD_WEBHOOK_TOKEN');
        return res.status(500).send({ success: false, errors: [{ message: 'Unable to forward feedback' }] });
    }

    if (!req.body.suggestion) {
        console.error('Missing `suggestion`');
        return res.status(400).send({ success: false, errors: [{ message: 'Missing `suggestion` field' }] });
    }

    if (typeof req.body.suggestion != 'string') {
        console.error('Invalid type of `suggestion`: ', req.body.suggestion);
        return res.status(400).send({ success: false, errors: [{ message: 'Invalid `suggestion` field' }] });
    }

    if (req.body.email && typeof req.body.email != 'string') {
        console.error('Invalid type of `email`: ', req.body.email);
        return res.status(400).send({ success: false, errors: [{ message: 'Invalid `email` field' }] });
    }

    if (req.body.discord && typeof req.body.discord != 'string') {
        console.error('Invalid type of `discord`: ', req.body.discord);
        return res.status(400).send({ success: false, errors: [{ message: 'Invalid `discord` field' }] });
    }

    if (req.body.page && typeof req.body.page != 'string') {
        console.error('Invalid type of `page`: ', req.body.page);
        return res.status(400).send({ success: false, errors: [{ message: 'Invalid `page` field' }] });
    }

    const message = `New feedback:
**discord:** ${req.body.discord && req.body.discord.length ? req.body.discord : '*(none)*'}
**email:** ${req.body.email && req.body.email.length ? req.body.email : '*(none)*'}
**page:** ${req.body.page && req.body.page.length ? `http://twrponly.tv${req.body.page}` : '*(none)*'}
> ${markdownEscape(req.body.suggestion).split('\n').join('\n> ')}
`;

    const webhookMessage: WebhookMessage = {
        content: message,
        username: 'FeedbackBot',
    };

    try {
        const answer = await axios.post(`https://discord.com/api/webhooks/${webhookID}/${webhookToken}`, webhookMessage);
        console.log(JSON.stringify({
            message: 'Posted tost to Discord',
            path: parseurl.original(req)?.pathname,
            status: answer.status,
            statusText: answer.statusText,
            data: answer.data,
        }));
        return res.send({ success: true });
    } catch (error) {
        console.error(JSON.stringify({
            message: 'Failed to post to Discord',
            path: parseurl.original(req)?.pathname,
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
        }));
        return res.status(500).send({ success: false, errors: [{ message: 'Unable to forward feedback' }] });
    }
});

export default router;
