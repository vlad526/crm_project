import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './intefaces/jwt-payload.interface';
import { TokenRepository } from '../../repository/services/token.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {
    const jwtAccessSecret = configService.get<string>('JWT_ACCESS_SECRET');

    if (!jwtAccessSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccessSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload?.jti) {
      throw new UnauthorizedException('Invalid token type');
    }

    const tokenEntity = await this.tokenRepository.findOne({
      where: { jti: payload.jti, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity || !tokenEntity.user) {
      throw new UnauthorizedException('Token is blocked or invalid');
    }

    if (!tokenEntity.user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    return tokenEntity.user;
  }
}