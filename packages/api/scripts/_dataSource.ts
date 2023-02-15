import { DataSource } from 'typeorm';
import dataSource from '../src/db/dataSource';
import migrations from './migrations';

export async function initializeDataStore(): Promise<DataSource> {
    if (!process.env.DATABASE_URL) {
        console.log('Missing DATABASE_URL');
        process.exit(1);
    }
    let ds = dataSource({
        postgresUrl: process.env.DATABASE_URL,
        insecure: process.env.ENV === 'dev',
    }).setOptions({
        logging: true,
        migrations,
    });
    return await ds.initialize();
}
