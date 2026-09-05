import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './services/users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { UserEntity } from '../../database/entities/user.entity';

import type { UserRequest } from '../auth/intefaces/user-request.interface';

import { IUsersRequestDto } from './models/dto/users.req.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Get('profile')
  async getProfile(@Request() req: UserRequest): Promise<UserEntity | null> {
    return await this.usersService.findById(req.user!.userId);
  }

  @Roles(UserRoleEnum.ADMIN)
  @Post('create')
  async create(@Body() usersRequestDto: IUsersRequestDto): Promise<UserEntity> {
    return await this.usersService.create(usersRequestDto);
  }
  @Roles(UserRoleEnum.ADMIN)
  @Delete('delete')
  async delete(@Param() id: number): Promise<void> {
    return await this.usersService.delete(id);
  }
}
