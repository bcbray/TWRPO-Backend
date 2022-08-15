import { DataSource } from 'typeorm';
import dataSource from '../src/db/dataSource';
import migrations from './migrations';

export async function initializeDataStore(): Promise<DataSource> {
    if (!process.env.DATABASE_URL) {
        console.log('Missing DATABASE_URL');
        process.exit(1);
    }
    let ds = dataSource(process.env.DATABASE_URL).setOptions({
        logging: true,
        migrations,
    });
    ds = await ds.initialize();
    ds = ds.setOptions({ logging: true });
    return ds;
}
