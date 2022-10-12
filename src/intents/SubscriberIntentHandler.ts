import { getIntentName, getLocale, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import axios, { AxiosResponse } from 'axios';
import { ChannelSearchResults } from '../models/ChannelSearchResults';
import { getSetupMessage } from '../helper/SetupHelper';

export const SubscriberIntentHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getIntentName(input.requestEnvelope) === 'subscribers';
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
            const channelSearchResponse: AxiosResponse = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${user.channelId}&key=${process.env.API_KEY}`
            );

            const searchResults: ChannelSearchResults.RootObject = channelSearchResponse.data;
            const subscriberCount = searchResults.items[0].statistics.subscriberCount;

            return input
                .responseBuilder
                .speak(messages['subscribers'].replace('%subscriber%', subscriberCount))
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