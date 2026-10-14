import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],

  synchronize: false,

  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;