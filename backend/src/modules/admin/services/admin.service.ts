import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { UsersRepository } from '../../../repository/services/users.repository';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../auth/services/email.service';
import { CreateManagerReqDto } from '../models/dto/req/create-manager.req.dto';
import { UserBaseResDto } from '../../users/models/dto/res/users-base-res';
import bcrypt from 'bcrypt';
import process from 'node:process';

import { IActionTokenPayload } from '../../auth/intefaces/IAction-token-payload.interface';
import { EmailTypeEnum } from '../../../database/entities/enums/email-type.enum';

import { UserResDto } from '../../users/models/dto/res/user.res.dto';
import { OrdersStatsDto } from '../../orders/dto/req/order.stats.dto';
import { OrdersService } from '../../orders/services/orders.service';
import { UserWithStatsResDto } from '../../users/models/dto/res/user-with-stats-res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly ordersService: OrdersService,
  ) {}

  async createManager(dto: CreateManagerReqDto): Promise<UserBaseResDto> {
    const existingByEmail = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingByEmail) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    let baseUsername = (dto.username || dto.email.split('@')[0]).slice(0, 20);
    let username = baseUsername;

    const existingByUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingByUsername) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      username = `${baseUsername}_${randomSuffix}`.slice(0, 25);
    }

    const basePassword = await bcrypt.hash(Math.random().toString(36), 10);

    const managerEntity = this.usersRepository.create({
      ...dto,
      username,
      password: basePassword,
    });

    return await this.usersRepository.save(managerEntity);
  }

  async createActivationToken(
    managerId: number,
  ): Promise<{ link: string; emailSent: boolean }> {
    const manager = await this.usersService.findById(managerId);
    if (!manager) {
      throw new NotFoundException(`User ${managerId} not found`);
    }
    const payload: IActionTokenPayload = {
      sub: manager.id,
      email: manager.email,
      action: 'activate',
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    const link = `${process.env.APP_FRONT_URL}/auth/activate/${token}`;

    await this.usersRepository.update(managerId, { actionToken: token });

    let emailSent = true;
    try {
      await this.emailService.sendEmail(
        EmailTypeEnum.ACTIVATE_ACCOUNT,
        manager.email,
        {
          name: manager.name,
          link: link,
        },
      );
    } catch (error) {
      emailSent = false;
      console.error('Activation email failed to send:', error);
    }

    return { link, emailSent };
  }

  async createRecoveryToken(
    userId: number,
  ): Promise<{ link: string; emailSent: boolean }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const payload: IActionTokenPayload = {
      sub: user.id,
      email: user.email,
      action: 'recovery',
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    const link = `${process.env.APP_FRONT_URL}/auth/recovery/${token}`;

    await this.usersRepository.update(userId, { actionToken: token });

    let emailSent = true;
    try {
      await this.emailService.sendEmail(
        EmailTypeEnum.FORGOT_PASSWORD,
        user.email,
        {
          name: user.name,
          link: link,
        },
      );
    } catch (error) {
      emailSent = false;
      console.error('Recovery email failed to send:', error);
    }

    return { link, emailSent };
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 5,
  ): Promise<{
    users: UserWithStatsResDto[];
    total: number;
    stats: OrdersStatsDto;
  }> {
    const { items: fetchedUsers, totalItems: totalCount } =
      await this.usersService.findAll(page, limit);

    const globalOrdersStats = await this.ordersService.getStatsByStatus();
    const managersPerformance =
      await this.ordersService.getManagersPerformance();

    const mappedUsersWithStats = fetchedUsers.map((user) => {
      const userPerformance = managersPerformance.find(
        (performance) => performance.managerId === user.id,
      );

      return {
        ...user,
        stats: userPerformance || {
          total: 0,
          new: 0,
          agree: 0,
          in_work: 0,
          disagree: 0,
          dubbing: 0,
        },
      };
    });

    return {
      users: mappedUsersWithStats,
      total: totalCount,
      stats: globalOrdersStats,
    };
  }

  disableUser(userId: number, adminUser: UserResDto): Promise<UserResDto> {
    return this.usersService.disable(userId, adminUser);
  }

  enableUser(userId: number, adminUser: UserResDto): Promise<UserResDto> {
    return this.usersService.enable(userId, adminUser);
  }

  getOrdersStats(): Promise<OrdersStatsDto> {
    return this.ordersService.getStatsByStatus();
  }
}