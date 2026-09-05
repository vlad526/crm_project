import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../../repository/services/users.repository';
import { TokenRepository } from '../../../repository/services/token.repository';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginReqDto } from '../dto/req/login.req.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { TokenEntity } from '../../../database/entities/token.entity';
import { ITokens } from '../intefaces/token.interface';
import { RefreshTokenDto } from '../models/refresh-token.dto';
import { IJwtPayload } from '../intefaces/jwt-payload.interface';
import { ActivateDto } from '../dto/req/activate.token.dto';
import { IActionTokenPayload } from '../intefaces/IAction-token-payload.interface';
import bcrypt from 'bcrypt';
import { UserResDto } from '../../users/models/dto/res/user.res.dto';
import { UserMapper } from '../../users/user.mapper';
import { EmailService } from './email.service';
import { EmailTypeEnum } from '../../../database/entities/enums/email-type.enum';
import { EnvService } from '../../../shared/env.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async login(loginReqDto: LoginReqDto): Promise<ITokens> {
    return this.entityManager.transaction(async (manager) => {
      const validUser = await this.validateUser(loginReqDto);
      const jti = Math.random().toString(36).substring(2);

      const tokenPayload = {
        userId: validUser.id,
        username: validUser.username,
        role: validUser.role,
        jti,
      };

      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: this.envService.jwtAccessSecret,
        expiresIn: this.envService.accessTokenExpirationTime,
      });

      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: this.envService.jwtRefreshSecret,
        expiresIn: this.envService.refreshTokenExpirationTime,
      });

      await this.saveTokens(
        manager,
        validUser,
        accessToken,
        refreshToken,
        this.envService.accessTokenExpirationTime,
        this.envService.refreshTokenExpirationTime,
        jti,
      );

      await manager
        .getRepository(UserEntity)
        .update(validUser.id, { lastLogin: new Date() });

      return { accessToken, refreshToken };
    });
  }

  async refresh(refreshDTO: RefreshTokenDto): Promise<ITokens> {
    const { refreshToken } = refreshDTO;
    return this.entityManager.transaction(async (manager) => {
      const tokenRepository = manager.getRepository(TokenEntity);

      try {
        this.jwtService.verify<IJwtPayload>(refreshToken, {
          secret: this.envService.jwtRefreshSecret,
        });
      } catch {
        throw new UnauthorizedException('invalid or expired refresh token');
      }

      const activeTokenEntity = await tokenRepository.findOne({
        where: { refreshToken, isBlocked: false },
        relations: ['user'],
      });

      if (
        !activeTokenEntity ||
        activeTokenEntity.refreshTokenExpiresAt < new Date()
      ) {
        throw new UnauthorizedException('invalid or expired refresh token');
      }

      activeTokenEntity.isBlocked = true;
      await tokenRepository.save(activeTokenEntity);

      const jti = Math.random().toString(36).substring(2);
      const newPayload = {
        userId: activeTokenEntity.user.id,
        username: activeTokenEntity.user.username,
        role: activeTokenEntity.user.role,
        jti,
      };

      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.envService.jwtAccessSecret,
        expiresIn: this.envService.accessTokenExpirationTime,
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.envService.jwtRefreshSecret,
        expiresIn: this.envService.refreshTokenExpirationTime,
      });

      await this.saveTokens(
        manager,
        activeTokenEntity.user,
        newAccessToken,
        newRefreshToken,
        this.envService.accessTokenExpirationTime,
        this.envService.refreshTokenExpirationTime,
        jti,
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    });
  }

  async activateUser(dto: ActivateDto) {
    let tokenPayload: IActionTokenPayload;

    try {
      tokenPayload = this.jwtService.verify(dto.token, {
        secret: this.envService.jwtAccessSecret,
      });
    } catch {
      throw new BadRequestException('invalid or expired activation token');
    }

    if (tokenPayload.action !== 'activate') {
      throw new BadRequestException('invalid token type');
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: tokenPayload.sub,
        actionToken: dto.token,
      },
      select: ['id', 'email', 'name', 'password', 'isActive', 'actionToken'],
    });

    if (!user) {
      throw new NotFoundException('User not found or invalid token');
    }
    if (user.isActive) {
      throw new BadRequestException('User is already active');
    }
    const newHashedPassword = await bcrypt.hash(dto.password, 10);

    await this.usersRepository.update(user.id, {
      password: newHashedPassword,
      isActive: true,
      actionToken: null,
    });

    this.emailService
      .sendEmail(EmailTypeEnum.WELCOME, user.email, { name: user.name })
      .catch((err) => this.logger.error('Welcome email failed to send', err));

    return { message: 'Account is active now' };
  }

  async recoveryUser(dto: ActivateDto) {
    let tokenPayload: IActionTokenPayload;

    try {
      tokenPayload = this.jwtService.verify(dto.token, {
        secret: this.envService.jwtAccessSecret,
      });
    } catch {
      throw new BadRequestException('invalid or expired activation token');
    }

    if (tokenPayload.action !== 'recovery') {
      throw new BadRequestException('invalid token type');
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: tokenPayload.sub,
        actionToken: dto.token,
      },
      select: ['id', 'email', 'name', 'password', 'isActive', 'actionToken'],
    });

    if (!user) {
      throw new NotFoundException('User not found or invalid token');
    }

    const newHashedPassword = await bcrypt.hash(dto.password, 10);

    await this.usersRepository.update(user.id, {
      password: newHashedPassword,
      actionToken: null,
    });

    this.emailService
      .sendEmail(EmailTypeEnum.WELCOME, user.email, { name: user.name })
      .catch((err) => this.logger.error('Welcome email failed to send', err));

    return { message: 'Password recovery completed' };
  }

  async logOut(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const { refreshToken } = refreshTokenDto;
    const tokenEntity = await this.tokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
    });
    if (tokenEntity) {
      tokenEntity.isBlocked = true;
      await this.tokenRepository.save(tokenEntity);
    }
  }

  async getMe(user: Partial<UserEntity>): Promise<UserResDto> {
    const userFromDb = await this.usersRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.total_orders', 'user.orders')
      .where('user.id = :id', { id: user.id })
      .getOne();
    if (!userFromDb) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResDto(userFromDb);
  }

  private async validateUser(loginDTO: LoginReqDto): Promise<UserEntity> {
    const { login, password } = loginDTO;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :login OR user.email = :login', { login })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('invalid login credentials');
    }

    if (!user.password) {
      this.logger.error(
        `У користувача ${user.email} відсутній хеш пароля в БД!`,
      );
      throw new UnauthorizedException('invalid login credentials');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid login credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }

    return user;
  }

  private async saveTokens(
    manager: EntityManager,
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    jti: string,
  ): Promise<void> {
    const tokenRepository = manager.getRepository(TokenEntity);

    const tokenEntity = tokenRepository.create({
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + accessTokenExpiresIn * 1000),
      refreshTokenExpiresAt: new Date(
        Date.now() + refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
    });
    await tokenRepository.save(tokenEntity);
  }
}
