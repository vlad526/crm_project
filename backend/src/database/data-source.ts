import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3308', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'crm-school',
  database: process.env.DB_NAME || 'crm-school_db',

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],

  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
