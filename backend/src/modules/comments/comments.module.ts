import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './services/comments.service';
import { UsersModule } from '../users/users.module';
import { OrderEntity } from '../../database/entities/order.entity';
import { CommentsRepository } from '../../repository/services/comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), UsersModule],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
