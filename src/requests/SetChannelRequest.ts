import { Request, Response } from 'express';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';
import axios, { AxiosResponse } from 'axios';

export async function setChannelRequest(request: Request, response: Response): Promise<void> {
    const requestedCode: number | null = request.body.code;
    const channelId: string | null = request.body.channelId;
    if (!requestedCode || !channelId) {
        response.status(400).json({
            error: 'The request is invalid'
        });
        return;
    }
    const user: User | null = await appDataSource.getRepository(User).findOne({
        where: {
            code: requestedCode
        }
    });
    if (!user) {
        response.status(400).json({
            error: 'The code is invalid'
        });
        return;
    }

    try {
        const channelSearchResponse: AxiosResponse = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${process.env.API_KEY}`
        );
        const searchResults: number = channelSearchResponse.data['pageInfo']['totalResults'];

        if (searchResults === 0) {
            response.status(400).json({
                error: 'This channel does not exists'
            });
            return;
        }
    } catch (error: any) {
        console.log('Failed to request channel id from YouTube Api');
        response.status(500).json({
            error: 'Something went wrong'
        });
        return;
    }

    user.code = null;
    user.channelId = channelId;
    await appDataSource.getRepository(User).save(user);
    response.json({
        success: 'The channel has been set'
    });
}