import { getLocale, getRequestType, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import axios, { AxiosResponse } from 'axios';
import { ChannelSearchResults } from '../models/ChannelSearchResults';
import { getSetupMessage } from '../helper/SetupHelper';

export const LaunchRequestHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getRequestType(input.requestEnvelope) === 'LaunchRequest';
    },
    async handle(input: HandlerInput): Promise<Response> {
        const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);
        const user: User | null = await appDataSource.getRepository(User).findOne({
            where: {
                id: getUserId(input.requestEnvelope)
            }
        });
        if (!user?.channelId) {
            return getSetupMessage(input);
        }

        try {
            const channelSearchResponse: AxiosResponse = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${user?.channelId}&key=${process.env.API_KEY}`
            );

            const searchResults: ChannelSearchResults.RootObject = channelSearchResponse.data;
            const subscriberCount: string = searchResults.items[0].statistics.subscriberCount;
            const username: string = searchResults.items[0].snippet.title;

            return input
                .responseBuilder
                .speak(
                    messages['welcome']
                        .replace('%username%', username)
                        .replace('%subscribers%', subscriberCount)
                )
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