import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TransformHelper } from '../../../../common/helpers/trim.helper';

export class RegisterReqDto {
  @ApiProperty({ example: 'user1' })
  @IsOptional()
  @IsString()
  @Length(2, 25)
  username: string;

  @ApiProperty({ example: 'user1@gmail.com' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'vlad' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @Transform(TransformHelper.trim)
  name: string;

  @ApiProperty({ example: 'Popov' })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  @Transform(TransformHelper.trim)
  surname: string;

  @ApiProperty({ example: 'P@ssword1' })
  @IsString()
  @Length(8, 300)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one letter, one number and one special character',
    },
  )
  password: string;
}
