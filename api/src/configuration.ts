import { DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './providers/persistance/configuration';

export type Configuration = {
  port: number;
  database: DataSourceOptions;
};

export default (): Configuration => ({
  port: 3000,
  database: dataSourceOptions,
});
