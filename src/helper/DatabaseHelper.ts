import { DataSource } from 'typeorm';
import { User } from '../entities/User';

export const appDataSource: DataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT ?? '3306'),
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    synchronize: false,
    entities: [
        User
    ]
});

export async function connectToDatabase(): Promise<void> {
    try {
        await appDataSource.initialize();
    } catch (error: any) {
        console.log('Failed to connect to database');
        console.log(error.message);
    }
}