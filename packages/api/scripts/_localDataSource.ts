import dataSource from '../src/db/dataSource';
import migrations from './migrations';

export default dataSource('postgres://localhost:5432').setOptions({
    logging: true,
    migrations,
});
