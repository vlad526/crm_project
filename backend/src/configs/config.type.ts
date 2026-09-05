export type Config = {
  app: AppConfig;
  database: DatabaseConfig;
  aws: AwsConfig;
  jwt: JwtConfig;
  email: EmailConfig;
};

export type AppConfig = {
  port: number;
  host: string;
  frontUrl: string;
};
export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
};

export type AwsConfig = {
  accessKey: string;
  secretKey: string;
};

export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};

export type EmailConfig = {
  smtpEmail: string;
  smtpPassword: string;
  smtpManagerEmail: string;
};
