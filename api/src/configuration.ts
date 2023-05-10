import { DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './adapters/persistence/configuration';

export type Configuration = {
  port: number;
  database: DataSourceOptions;
};

export default (): Configuration => ({
  port: 3000,
  database: dataSourceOptions,
});
