import { initializeDataStore } from './_dataSource';

async function bootstrap(): Promise<void> {
    const dataStore = await initializeDataStore();
    console.info('Running revert');
    await dataStore.undoLastMigration();
}

bootstrap()
    .then(() => {
        console.log('Database reverted!');
        process.exit(0);
    });
