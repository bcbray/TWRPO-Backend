import { initializeDataStore } from './_dataSource';
import { StreamChunk } from '../src/db/entity/StreamChunk';

async function bootstrap(): Promise<void> {
  const dataStore = await initializeDataStore();
  const tableName = dataStore.getMetadata(StreamChunk).tableName;
  const queryRunner = dataStore.createQueryRunner()
  const hasTable = await queryRunner.hasTable(tableName);
  if (!hasTable) {
    console.log('Synchronizing');
    await dataStore.synchronize();
  } else {
    console.info('Running migrations');
    await dataStore.runMigrations();
  }
}


bootstrap()
  .then(() => {
    console.log('Database bootstrapped!');
    process.exit(0);
  });
