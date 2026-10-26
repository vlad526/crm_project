import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusesEnum } from '../../../../database/entities/enums/statuses.enum';
import { CoursesEnum } from '../../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../../database/entities/enums/types.enum';

const emptyToNull = ({ value }: { value: any }) =>
  value === '' ? null : value;

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(25)
  name?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(25)
  surname?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsEmail()
  @MaxLength(100)
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(12)
  phone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsInt()
  @Min(0)
  @Max(99)
  age?: number | null;

  @ApiPropertyOptional({ enum: CoursesEnum })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsEnum(CoursesEnum)
  course?: CoursesEnum | null;

  @ApiPropertyOptional({ enum: FormatsEnum })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsEnum(FormatsEnum)
  course_format?: FormatsEnum | null;

  @ApiPropertyOptional({ enum: TypesEnum })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsEnum(TypesEnum)
  course_type?: TypesEnum | null;

  @ApiPropertyOptional({ enum: StatusesEnum })
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsEnum(StatusesEnum)
  status?: StatusesEnum | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  sum?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  alreadyPaid?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(emptyToNull)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsInt()
  group?: number | null;

  @IsOptional()
  @IsString()
  utm?: string;

  @IsOptional()
  @IsString()
  msg?: string;
}