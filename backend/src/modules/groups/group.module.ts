import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../../database/entities/group.entity';
import { GroupRepository } from '../../repository/services/group.repository';
import { GroupService } from './services/group--flat/group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupRepository, GroupService],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupModule {}
