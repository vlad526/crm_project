import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { GroupService } from './services/group--flat/group.service';
import { GroupCreateDto } from './models/group-create.dto';
import { GroupResDto } from './models/group-res.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @Post()
  create(@Body() dto: GroupCreateDto): Promise<GroupResDto> {
    return this.groupService.create(dto);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @Get()
  findAll(): Promise<GroupResDto[]> {
    return this.groupService.findAll();
  }
}