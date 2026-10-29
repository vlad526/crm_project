import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { UsersRepository } from '../../repository/services/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, UsersRepository],
  controllers: [],
  exports: [UsersService, TypeOrmModule, UsersRepository],
})
export class UsersModule {}