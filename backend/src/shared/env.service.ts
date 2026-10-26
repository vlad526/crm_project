import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  public readonly db_Type: string;
  public readonly mysqlHost: string;
  public readonly mysqlPort: number;
  public readonly mysqlDatabase: string;
  public readonly mysqlUser: string;
  public readonly mysqlPassword: string;
  public readonly dbSsl: boolean;

  public readonly jwtAccessSecret: string;
  public readonly jwtRefreshSecret: string;
  public readonly accessTokenExpirationTime: number;
  public readonly refreshTokenExpirationTime: number;

  public readonly adminEmail: string;
  public readonly adminPassword: string;

  constructor(private configService: ConfigService) {
    this.db_Type = this.configService.get<string>('DB_TYPE') || 'mysql';

    this.mysqlHost =
      this.configService.get<string>('MYSQL_HOST') ||
      this.configService.get<string>('DB_HOST') ||
      '127.0.0.1';

    this.mysqlPort = parseInt(
      this.configService.get<string>('MYSQL_PORT') ||
      this.configService.get<string>('DB_PORT') ||
      '3306',
      10,
    );

    this.mysqlDatabase =
      this.configService.get<string>('MYSQL_DATABASE') ||
      this.configService.get<string>('DB_NAME') ||
      'defaultdb';

    this.mysqlUser =
      this.configService.get<string>('MYSQL_USER') ||
      this.configService.get<string>('DB_USERNAME') ||
      'avnadmin';

    this.mysqlPassword =
      this.configService.get<string>('MYSQL_PASSWORD') ||
      this.configService.get<string>('DB_PASSWORD') ||
      '';

    this.dbSsl =
      this.configService.get<string>('DB_SSL') === 'true' ||
      this.configService.get<string>('MYSQL_SSL') === 'true';

    this.jwtAccessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || '';
    this.jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || '';

    this.accessTokenExpirationTime =
      Number(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')) || 900;
    this.refreshTokenExpirationTime =
      Number(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')) || 1800;

    this.adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@gmail.com';
    this.adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin';
  }
}