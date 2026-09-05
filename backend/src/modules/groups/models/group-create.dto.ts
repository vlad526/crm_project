import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../common/helpers/trim.helper';

export class GroupCreateDto {
  @ApiProperty({ example: 'VIP' })
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  name: string;
}
