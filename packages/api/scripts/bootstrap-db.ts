import { initializeDataStore } from './_dataSource';

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
