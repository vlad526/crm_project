import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Invalid login or password' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'P@ssword123' })
  @IsNotEmpty({ message: 'Invalid login or password' })
  @IsString()
  password: string;
}
