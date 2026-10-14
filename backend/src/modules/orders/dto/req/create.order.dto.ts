import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  Length,
  Min,
  IsEnum,
  MaxLength,
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

  @ApiProperty({ example: '+380676487621' })
  @IsOptional()
  @IsString()
  @MaxLength(12, { message: 'Phone number must not exceed 12 characters' })
  @Transform(TransformHelper.toPhone)
  phone?: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @ApiProperty({ enum: CoursesEnum, example: CoursesEnum.FS })
  @IsOptional()
  @IsEnum(CoursesEnum, { message: 'Course must be a valid course enum value' })
  @Transform(TransformHelper.trim)
  course?: CoursesEnum;

  @ApiProperty({ enum: FormatsEnum, example: FormatsEnum.ONLINE })
  @IsOptional()
  @IsEnum(FormatsEnum, { message: 'Course format must be a valid format enum value' })
  @Transform(TransformHelper.trim)
  course_format?: FormatsEnum;

  @ApiProperty({ enum: TypesEnum, example: TypesEnum.PRO })
  @IsOptional()
  @IsEnum(TypesEnum, { message: 'Course type must be a valid type enum value' })
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

  @ApiProperty({ enum: StatusesEnum, example: StatusesEnum.NEW })
  @IsOptional()
  @IsEnum(StatusesEnum, { message: 'Status must be a valid status enum value' })
  status?: StatusesEnum;
}