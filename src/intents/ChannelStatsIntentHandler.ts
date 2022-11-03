import { getIntentName, getLocale, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import axios, { AxiosResponse } from 'axios';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import { ChannelSearchResults } from '../models/ChannelSearchResults';
import { getSetupMessage } from '../helper/SetupHelper';

export const ChannelStatsIntentHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getIntentName(input.requestEnvelope) === 'channelstats';
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
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${user.channelId}&key=${process.env.API_KEY}`
            );

            const channelResponse: ChannelSearchResults.RootObject = channelSearchResponse.data;
            const channel: ChannelSearchResults.Item = channelResponse.items[0];

            return input
                .responseBuilder
                .speak(
                    messages['channel_stats']
                        .replace('%views%', channel.statistics.viewCount)
                        .replace('%videos%', channel.statistics.videoCount)
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