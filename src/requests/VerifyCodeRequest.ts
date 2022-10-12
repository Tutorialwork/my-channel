import { Request, Response } from 'express';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';

export async function verifyCodeRequest(request: Request, response: Response): Promise<void> {
    const requestedCode: number | null = request.body.code;
    if (!requestedCode) {
        response.status(400).json({
            error: 'The code is missing'
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
    response.json({
       success: 'Code is valid'
    });
}