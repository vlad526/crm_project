import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AdminService } from './services/admin.service';
import { AdminController } from './admin.controller';
import { OrdersModule } from '../orders/order.module';

@Module({
  imports: [UsersModule, AuthModule, OrdersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
