import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/trim.helper';
import { UserRoleEnum } from '../../../../database/entities/enums/user-role.enum';

export class IUsersRequestDto {
  @ApiProperty({ example: 'Vlad' })
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  name?: string;

  @ApiProperty({ example: 'Popov' })
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  surname?: string;

  @ApiProperty({ example: 'Popov123' })
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  username: string;

  @ApiProperty({ example: 'Popov' })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({ example: 'P@ssword1' })
  @Length(8, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&]).*$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  password: string;

  @ApiProperty({ example: 'manager' })
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
