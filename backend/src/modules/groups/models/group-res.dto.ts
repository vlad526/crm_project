import { ApiProperty } from '@nestjs/swagger';

export class GroupResDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'VIP' })
  name: string;
}
