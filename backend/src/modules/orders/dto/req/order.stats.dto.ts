import { ApiProperty } from '@nestjs/swagger';

export class OrdersStatsDto {
  @ApiProperty({ example: 215 })
  total: number;

  @ApiProperty({ example: 5 })
  agree: number;

  @ApiProperty({ example: 3 })
  in_work: number;

  @ApiProperty({ example: 4 })
  disagree: number;

  @ApiProperty({ example: 3 })
  dubbing: number;

  @ApiProperty({ example: 200 })
  new: number;
}
export class ManagerPerformanceDto extends OrdersStatsDto {
  @ApiProperty({ example: 1 })
  managerId: number;
}
