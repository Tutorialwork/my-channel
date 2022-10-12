import { Response } from 'ask-sdk-model';
import { getLocale, HandlerInput } from 'ask-sdk-core';

export function getSetupMessage(input: HandlerInput, code: number | null | undefined): Response {
    const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);

    return input
        .responseBuilder
        .speak(messages['setup']['setup_speak'])
        .withSimpleCard(messages['setup']['card']['title'], messages['setup']['card']['message'].replace('%code%', code))
        .getResponse();
}