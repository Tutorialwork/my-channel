import { CustomSkill } from 'ask-sdk-core/dist/skill/CustomSkill';
import { SkillBuilders } from 'ask-sdk-core';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import express from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit'
import cors from 'cors';
import { LaunchRequestHandler } from './intents/LaunchRequestHandler';
import { connectToDatabase } from './helper/DatabaseHelper';
import { UserCreation } from './middleware/UserCreation';
import { verifyCodeRequest } from './requests/VerifyCodeRequest';
import { setChannelRequest } from './requests/SetChannelRequest';
import { searchChannelRequest } from './requests/SearchChannelRequest';
import { SubscriberIntentHandler } from './intents/SubscriberIntentHandler';
import { LastVideoIntentHandler } from './intents/LastVideoIntentHandler';
import { ChannelStatsIntentHandler } from './intents/ChannelStatsIntentHandler';
import { LastCommentIntentHandler } from './intents/LastCommentIntentHandler';
import { SessionEndedRequestHandler } from './intents/SessionEndedRequestHandler';
import { StopIntentHandler } from './intents/StopIntentHandler';
import { HelpIntentHandler } from './intents/HelpIntentHandler';

const skill: CustomSkill = SkillBuilders
    .custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SubscriberIntentHandler,
        LastVideoIntentHandler,
        ChannelStatsIntentHandler,
        LastCommentIntentHandler,
        StopIntentHandler,
        HelpIntentHandler
    )
    .addRequestInterceptors(
        UserCreation
    )
    .addErrorHandlers(
        SessionEndedRequestHandler
    )
    .create();

const adapter: ExpressAdapter = new ExpressAdapter(skill, true, true);

const codeApiRateLimit: RateLimitRequestHandler = rateLimit({
    windowMs: 120 * 60 * 1000,
    max: 10,
    standardHeaders: false,
    legacyHeaders: false,
    message: {
        error: 'Too many requests'
    }
});

const app = express();
app.disable('x-powered-by');
app.post('', adapter.getRequestHandlers());
app.use(express.json());
app.use(cors());
app.post('/verify', codeApiRateLimit, verifyCodeRequest);
app.post('/channel', codeApiRateLimit, setChannelRequest);
app.get('/channel/:query', searchChannelRequest);

app.listen(3000);

connectToDatabase();
