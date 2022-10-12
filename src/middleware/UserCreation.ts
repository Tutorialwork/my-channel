import { getUserId, HandlerInput, RequestInterceptor } from 'ask-sdk-core';
import { User } from '../entities/User';
import { appDataSource } from '../helper/DatabaseHelper';

export const UserCreation: RequestInterceptor = {
    async process(input: HandlerInput): Promise<void> {
        const userId: string = getUserId(input.requestEnvelope);
        const existingUser: User | null = await appDataSource.getRepository(User).findOne({
            where: {
                id: userId
            }
        });
        if (!existingUser) {
            const user: User = new User();
            user.id = userId;
            user.code = Math.floor(Math.random() * 999999) + 100000;
            await appDataSource.getRepository(User).save(user);
        }
    }
};