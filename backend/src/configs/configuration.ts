import * as process from 'node:process';

import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    host: process.env.APP_HOST ?? 'localhost',
    frontUrl: process.env.APP_FRONT_URL ?? 'http://localhost:5173',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    name: process.env.DB_DATABASE ?? 'crm',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'secret_access_key',
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? '900', 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'secret_refresh_key',
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '1800',
      10,
    ),
  },
  email: {
    smtpEmail: process.env.SMTP_EMAIL ?? '',
    smtpPassword: process.env.SMTP_PASSWORD ?? '',
    smtpManagerEmail: process.env.SMTP_MANAGER_EMAIL ?? '',
  },
});
