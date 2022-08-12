import { DataSource } from 'typeorm';
import dataSource from '../src/db/dataSource';

export async function initializeDataStore(): Promise<DataSource> {
  if (!process.env.DATABASE_URL) {
      console.log('Missing DATABASE_URL');
      process.exit(1);
  }
  let ds = dataSource(process.env.DATABASE_URL);
  ds = await ds.initialize()
  ds = ds.setOptions({ logging: true });
  return ds;
}
