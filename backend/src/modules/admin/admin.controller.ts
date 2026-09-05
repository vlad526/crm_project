import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserResDto } from '../users/models/dto/res/user.res.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { AdminService } from './services/admin.service';

import { CreateManagerReqDto } from './models/dto/req/create-manager.req.dto';
import { UserBaseResDto } from '../users/models/dto/res/users-base-res';
import { UserWithStatsResDto } from '../users/models/dto/res/user-with-stats-res.dto';
import { OrdersStatsDto } from '../orders/dto/req/order.stats.dto';

export interface RequestWithUser extends Request {
  user: UserResDto;
}

@ApiTags('Admin')
@ApiBearerAuth('accessToken')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles(UserRoleEnum.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('managers')
  async createManager(
    @Body() createManagerDto: CreateManagerReqDto,
  ): Promise<UserBaseResDto> {
    return this.adminService.createManager(createManagerDto);
  }
  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{
    users: UserWithStatsResDto[];
    total: number;
    stats: OrdersStatsDto;
  }> {
    return this.adminService.getAllUsers(page, limit);
  }
  @Post(':id/activation-token')
  async activationToken(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.createActivationToken(id);
  }
  @Post(':id/recovery-token')
  async recoveryToken(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.createRecoveryToken(id);
  }

  @Patch(':id/ban')
  async ban(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<UserResDto> {
    return await this.adminService.disableUser(id, req.user);
  }
  @Patch(':id/unban')
  async unban(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<UserResDto> {
    return await this.adminService.enableUser(id, req.user);
  }
  @Get('orders/stats')
  getOrdersStats(): Promise<OrdersStatsDto> {
    return this.adminService.getOrdersStats();
  }
}
