import dataSource from '../src/db/dataSource';
import migrations from './migrations';

export default dataSource({
    postgresUrl: 'postgres://localhost:5432',
    insecure: true,
}).setOptions({
    logging: true,
    migrations,
});
