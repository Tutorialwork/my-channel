import { getIntentName, getLocale, getUserId, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import axios, { AxiosResponse } from 'axios';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import { VideoSearchResults } from '../models/VideoSearchResults';
import { VideoDetailsResults } from '../models/VideoDetailsResults';
import { LastVideoStats } from '../models/LastVideoStats';
import { getSetupMessage } from '../helper/SetupHelper';

export const LastVideoIntentHandler: RequestHandler = {
    canHandle(input: HandlerInput): Promise<boolean> | boolean {
        return getIntentName(input.requestEnvelope) === 'lastvideo';
    },
    async handle(input: HandlerInput): Promise<Response> {
        const user: User | null = await appDataSource.getRepository(User).findOne({
            where: {
                id: getUserId(input.requestEnvelope)
            }
        });
        const messages: any = require(`../languages/${getLocale(input.requestEnvelope)}.json`);

        if (!user?.channelId) {
            return getSetupMessage(input);
        }

        try {
            const lastVideosResponse: AxiosResponse = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${user.channelId}&maxResults=10&order=date&key=${process.env.API_KEY}`
            );

            const lastVideos: VideoSearchResults.RootObject = lastVideosResponse.data;
            let videoIds: string = '';

            lastVideos.items.every((video: VideoSearchResults.Item) => videoIds += video.id.videoId + ',');

            const videoDetailsResponse: AxiosResponse = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${process.env.API_KEY}`
            );

            const videoDetails: VideoDetailsResults.RootObject = videoDetailsResponse.data;
            const lastVideoDetails: VideoDetailsResults.Item = videoDetails.items[0];
            const lastVideoStats: LastVideoStats = {
                allVideosLikes: 0,
                allVideosViews: 0,
                averageVideoLikes: 0,
                averageVideoViews: 0
            };

            videoDetails.items.every((video: VideoDetailsResults.Item) => lastVideoStats.allVideosViews += Number.parseInt(video.statistics.viewCount));
            videoDetails.items.every((video: VideoDetailsResults.Item) => lastVideoStats.allVideosLikes += Number.parseInt(video.statistics.likeCount));

            lastVideoStats.averageVideoViews = lastVideoStats.allVideosViews / 10;
            lastVideoStats.averageVideoLikes = lastVideoStats.allVideosLikes / 10;

            let popularity = 0;
            if (Number.parseInt(lastVideoDetails.statistics.viewCount) > lastVideoStats.averageVideoViews) {
                popularity++;
            } else {
                popularity--;
            }

            if (Number.parseInt(lastVideoDetails.statistics.likeCount) > lastVideoStats.averageVideoLikes) {
                popularity++;
            } else {
                popularity--;
            }

            return input
                .responseBuilder
                .speak(
                    messages['last_video']['message']
                        .replace('%views%', lastVideoDetails.statistics.viewCount)
                        .replace('%likes%', lastVideoDetails.statistics.likeCount)
                        .replace('%state%', messages['last_video']['states'][popularity])
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