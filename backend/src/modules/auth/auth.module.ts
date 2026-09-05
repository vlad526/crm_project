import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { TokenEntity } from '../../database/entities/token.entity';
import { UsersRepository } from '../../repository/services/users.repository';
import { AuthService } from './services/auth.service';
import { TokenRepository } from '../../repository/services/token.repository';
import { AuthController } from './auth.controller';
import { EmailService } from './services/email.service';

import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET')!,
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES_IN') ||
            '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersRepository,
    TokenRepository,
    EmailService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
