import { Module } from '@nestjs/common';
import { TypeormModule } from './typeorm.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './configs/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER } from '@nestjs/core';
import { EmailModule } from './modules/auth/email.module';
import { GlobalExceptionFilter } from './filters/global-filter';
import { AdminModule } from './modules/admin/admin.module';
import { GroupModule } from './modules/groups/group.module';
import { CommentsModule } from './modules/comments/comments.module';
import { OrdersModule } from './modules/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeormModule,
    OrdersModule,
    AuthModule,
    SharedModule,
    UsersModule,
    AdminModule,
    CommentsModule,
    GroupModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}