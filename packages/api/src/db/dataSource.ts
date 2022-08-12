import path from 'path';
import { DataSource } from 'typeorm';

export default function dataSource(postgresUrl: string): DataSource {
    return new DataSource({
        type: 'postgres',
        url: postgresUrl,
        entities: [path.resolve(__dirname, 'entity/*.ts')],
        migrations: [path.resolve(__dirname, 'migration/*.ts')],
        subscribers: [],
    });
}
