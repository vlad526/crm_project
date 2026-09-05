import { ApiProperty } from '@nestjs/swagger';
import { UserBaseResDto } from './users-base-res';

export class ManagerPerformanceDto {
  @ApiProperty() total: number;
  @ApiProperty() new: number;
  @ApiProperty() agree: number;
  @ApiProperty() in_work: number;
  @ApiProperty() disagree: number;
  @ApiProperty() dubbing: number;
}

export class UserWithStatsResDto extends UserBaseResDto {
  @ApiProperty({ type: ManagerPerformanceDto })
  stats: ManagerPerformanceDto;
}
