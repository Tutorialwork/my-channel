import { getIntentName, getLocale, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import axios, { AxiosResponse } from 'axios';
import { CommentsResults } from '../models/CommentsResults';
import { getSetupMessage } from '../helper/SetupHelper';

export const LastCommentIntentHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getIntentName(input.requestEnvelope) === 'lastcomment';
    },
    async handle(input: HandlerInput): Promise<Response> {
        const user: User | null = await appDataSource.getRepository(User).findOne({
            where: {
                id: getUserId(input.requestEnvelope)
            }
        });
        const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);

        if (!user?.channelId) {
            return getSetupMessage(input, user?.code);
        }

        try {
            const lastCommentsResponse: AxiosResponse = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&allThreadsRelatedToChannelId=${user.channelId}&key=${process.env.API_KEY}`
            );

            const commentsResults: CommentsResults.RootObject = lastCommentsResponse.data;

            return input
                .responseBuilder
                .speak(messages['last_comment'].replace('%comment%', commentsResults.items[0].snippet.topLevelComment.snippet.textDisplay))
                .getResponse();
        } catch (error: any) {
            console.log(error.message);
            return input
                .responseBuilder
                .speak('Etwas ist schiefgelaufen')
                .getResponse();
        }
    }
}