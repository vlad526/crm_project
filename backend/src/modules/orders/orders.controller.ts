import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './services/orders.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../../database/entities/enums/user-role.enum';
import { ResponseOrderDto } from './dto/res/res.order.dto';
import { OrdersQueryDto } from './dto/req/order.query.dto';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JoiValidationPipe } from '../../common/validators/joi-validation.pipe';
import editOrderSchema from '../../common/validators/order.validator';
import { UpdateOrderDto } from './dto/req/update.order.dto';
import { UserEntity } from '../../database/entities/user.entity';
import type { Response } from 'express';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN)
  @Get('excel')
  async exportExcel(
    @Query() query: OrdersQueryDto,
    @CurrentUser('id') userId: number,
    @Res() res: Response,
  ) {
    const buffer = await this.ordersService.exportToExcel(query, userId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="orders_report.xlsx"',
      'Content-Length': buffer.byteLength,
    });

    res.end(buffer);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @Get()
  findAll(@Query() query: OrdersQueryDto, @CurrentUser('id') userId: number) {
    return this.ordersService.findAll(query, userId);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGER)
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(editOrderSchema))
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseOrderDto> {
    return this.ordersService.update(id, user, updateOrderDto);
  }
}