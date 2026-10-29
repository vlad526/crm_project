import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginReqDto } from './dto/req/login.req.dto';
import { ActivateDto } from './dto/req/activate.token.dto';
import * as userRequestInterface from './intefaces/user-request.interface';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginReqDto) {
    return await this.authService.login(loginDto);
  }

  @Patch('activate')
  @HttpCode(HttpStatus.OK)
  async activate(@Body() activateDto: ActivateDto) {
    return await this.authService.activateUser(activateDto);
  }

  @Patch('recovery')
  @HttpCode(HttpStatus.OK)
  async recovery(@Body() recoveryDto: ActivateDto) {
    return await this.authService.recoveryUser(recoveryDto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: userRequestInterface.UserRequest) {
    return await this.authService.getMe(req.user!);
  }
}