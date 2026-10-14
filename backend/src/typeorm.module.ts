import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { EnvService } from './shared/env.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (envService: EnvService) => ({
        type: envService.db_Type as 'mysql',
        host: envService.mysqlHost,
        port: envService.mysqlPort,
        username: envService.mysqlUser,
        password: envService.mysqlPassword,
        database: envService.mysqlDatabase,
        entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
        synchronize: false,
        migrations: [
          path.join(__dirname, 'database', 'migrations', '*{.ts,.js}'),
        ],
        ssl: envService.dbSsl ? { rejectUnauthorized: false } : undefined,
      }),
      inject: [EnvService],
    }),
  ],
})
export class TypeormModule {}