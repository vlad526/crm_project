import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateOrderDto } from './create.order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  group?: number;

  @IsOptional()
  manager?: number;
}
