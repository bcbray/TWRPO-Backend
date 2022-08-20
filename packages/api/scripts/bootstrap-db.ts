import { initializeDataStore } from './_dataSource';
import { StreamChunk } from '../src/db/entity/StreamChunk';

async function bootstrap(): Promise<void> {
    const dataStore = await initializeDataStore();
    console.info('Running migrations');
    await dataStore.runMigrations();
}

bootstrap()
    .then(() => {
        console.log('Database bootstrapped!');
        process.exit(0);
    });
