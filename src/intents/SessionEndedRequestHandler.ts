import { getRequestType, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export const SessionEndedRequestHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getRequestType(input.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(input: HandlerInput): Promise<Response> | Response {
        return input
            .responseBuilder
            .getResponse();
    }
}