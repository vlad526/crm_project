import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../../common/helpers/trim.helper';

export class CreateManagerReqDto {
  @ApiProperty({ example: 'manager@gmail.com' })
  @IsEmail()
  @MaxLength(320)
  @Transform(TransformHelper.trim)
  email!: string;

  @ApiProperty({ example: 'Ivan' })
  @IsString()
  @Length(2, 25)
  @Transform(TransformHelper.trim)
  name!: string;

  @ApiProperty({ example: 'Petrenko' })
  @IsString()
  @Length(2, 25)
  @Transform(TransformHelper.trim)
  surname!: string;

  @ApiPropertyOptional({ example: 'ivan_p' })
  @IsOptional()
  @IsString()
  @Length(3, 25)
  @Transform(TransformHelper.trim)
  username?: string;

  @ApiPropertyOptional({ example: '123qwe!@#QWE' })
  @IsOptional()
  @IsString()
  @Length(8, 300)
  password?: string;
}