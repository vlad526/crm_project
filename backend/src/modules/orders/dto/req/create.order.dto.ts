import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/trim.helper';
import { ApiProperty } from '@nestjs/swagger';
import { CoursesEnum } from '../../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../../database/entities/enums/statuses.enum';

export class CreateOrderDto {
  @ApiProperty({ example: 'Vlad' })
  @IsOptional()
  @IsString()
  @Length(0, 25)
  @Transform(TransformHelper.trim)
  name?: string;

  @ApiProperty({ example: 'Popov' })
  @IsOptional()
  @IsString()
  @Length(0, 25)
  @Transform(TransformHelper.trim)
  surname?: string;

  @ApiProperty({ example: 'vlad@gmail.com' })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed !== '' ? trimmed : undefined;
    }
    return undefined;
  })
  @IsOptional()
  @IsEmail()
  @Length(0, 100)
  email?: string;

  @ApiProperty({ example: '+38 (067) 648-76-21' })
  @IsOptional()
  @IsString()
  @Transform(TransformHelper.toPhone)
  phone?: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @ApiProperty({ example: 'FC' })
  @IsOptional()
  @Length(0, 10)
  @Transform(TransformHelper.trim)
  course?: CoursesEnum;

  @ApiProperty({ example: 'Online' })
  @IsOptional()
  @Length(0, 15)
  @Transform(TransformHelper.trim)
  course_format?: FormatsEnum;

  @ApiProperty({ example: 'VIP' })
  @IsOptional()
  @Length(0, 100)
  @Transform(TransformHelper.trim)
  course_type?: TypesEnum;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsInt()
  sum?: number;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsInt()
  alreadyPaid?: number;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(TransformHelper.trim)
  utm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(TransformHelper.trim)
  msg?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  status?: StatusesEnum;
}
