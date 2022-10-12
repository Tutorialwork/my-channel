import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

export async function searchChannelRequest(request: Request, response: Response): Promise<void> {
    const searchQuery: string = request.params.query;

    try {
        const channelSearchResponse: AxiosResponse = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/search?q=${searchQuery}&type=channel&part=snippet&key=${process.env.API_KEY}`
        );

        response.send(channelSearchResponse.data);
    } catch (error: any) {
        console.log('Failed to request YouTube api');
        console.log(error.message);

        response.status(500).json({
            error: 'Something went wrong'
        });
    }
}