import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../../common/helpers/trim.helper';

export class CreateManagerReqDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @MaxLength(320)
  @Transform(TransformHelper.trim)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(8, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&]).*$/, {
    message:
      'Password must contain at least one letter, one number and one special character',
  })
  password: string;

  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  username: string;

  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  name?: string;

  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  surname?: string;
}
