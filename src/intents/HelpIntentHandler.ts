import { getIntentName, getLocale, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export const HelpIntentHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getIntentName(input.requestEnvelope) === 'AMAZON.HelpIntent' ||
            getIntentName(input.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(input: HandlerInput): Promise<Response> | Response {
        const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);

        return input
            .responseBuilder
            .speak(messages['help'])
            .getResponse();
    }
}