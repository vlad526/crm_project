import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/order.entity';

import { UsersModule } from '../users/users.module';

import { UserEntity } from '../../database/entities/user.entity';
import { OrdersRepository } from '../../repository/services/orders.repository';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, UserEntity]), UsersModule],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
