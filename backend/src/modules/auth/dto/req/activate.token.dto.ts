import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;
}
