import * as process from 'node:process';

import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    host: process.env.APP_HOST ?? 'localhost',
    frontUrl: process.env.APP_FRONT_URL ?? 'http://localhost',
  },

  database: {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
    user: process.env.MYSQL_USER ?? 'user',
    password: process.env.MYSQL_PASSWORD ?? 'password',
    name: process.env.MYSQL_DATABASE ?? 'crm-programming-school',
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY ?? 'aws.accessKey',
    secretKey: process.env.AWS_SECRET_KEY ?? 'aws.secretKey',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'jwt.accessSecret',
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? '3600', 10),
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'jwt.refreshSecret',
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '800000',
      10,
    ),
  },
  email: {
    smtpEmail: process.env.SMTP_EMAIL ?? 'smtp.email',
    smtpPassword: process.env.SMTP_PASSWORD ?? 'smtp.password',
    smtpManagerEmail: process.env.SMTP_MANAGER_EMAIL ?? 'smtp.managerEmail',
  },
});
