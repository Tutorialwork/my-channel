import { getApiAccessToken, getLocale, getRequestType, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, SessionResumedRequest } from 'ask-sdk-model';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import axios, { AxiosResponse } from 'axios';
const Mailjet = require('node-mailjet');

export const SessionResumedRequestHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getRequestType(input.requestEnvelope) === 'SessionResumedRequest';
    },
    async handle(input: HandlerInput): Promise<Response> {
        const event: SessionResumedRequest = input.requestEnvelope.request as SessionResumedRequest;
        const permissionState: string = event.cause?.result.status;
        const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);
        const user: User | null = await appDataSource.getRepository(User).findOne({
            where: {
                id: getUserId(input.requestEnvelope)
            }
        });

        if (permissionState === 'DENIED') {
            input
                .responseBuilder
                .withSimpleCard(messages['setup']['card']['title'], messages['setup']['card']['message'].replace('%code%', user?.code));
        }

        if (permissionState === 'ACCEPTED') {
            const mailjet = new Mailjet({
                apiKey: process.env.MJ_APIKEY_PUBLIC,
                apiSecret: process.env.MJ_APIKEY_PRIVATE
            });

            try {
                const emailResponse: AxiosResponse = await axios.get(
                    `${input.requestEnvelope.context.System.apiEndpoint}/v2/accounts/~current/settings/Profile.email`,
                    {
                        headers: {
                            Authorization: `Bearer ${getApiAccessToken(input.requestEnvelope)}`
                        }
                    }
                );

                await mailjet
                    .post('send')
                    .request({
                        FromEmail: 'no-reply@pricenotify.app',
                        FromName: 'PriceNotify',
                        Subject: 'My channel',
                        'Text-Part': `https://skills.manuelschuler.dev/select-channel/${user?.code}`,
                        'HTML-Part': `https://skills.manuelschuler.dev/select-channel/${user?.code}`,
                        Recipients: [
                            {
                                Email: emailResponse.data
                            },
                        ],
                    });
            } catch (error: any) {}
        }

        return input
            .responseBuilder
            .speak(messages['setup']['email_permissions_status'][permissionState])
            .getResponse();
    }
}