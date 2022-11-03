import { Response } from 'ask-sdk-model';
import { getLocale, HandlerInput } from 'ask-sdk-core';

export function getSetupMessage(input: HandlerInput): Response {
    const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);

    return input
        .responseBuilder
        .speak(messages['setup']['email_setup_speak'])
        .addDirective({
            'type': 'Connections.StartConnection',
            'uri': 'connection://AMAZON.AskForPermissionsConsent/2',
            'input': {
                '@type': 'AskForPermissionsConsentRequest',
                '@version': '2',
                'permissionScopes': [
                    {
                        'permissionScope': 'alexa::profile:email:read',
                        'consentLevel': 'ACCOUNT'
                    }
                ]
            }
        })
        .getResponse();
}