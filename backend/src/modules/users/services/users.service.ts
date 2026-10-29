import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../../repository/services/users.repository';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserBaseResDto } from '../models/dto/res/users-base-res';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';
import { UserMapper } from '../user.mapper';
import { UserResDto } from '../models/dto/res/user.res.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(managerId: number): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({
      where: { id: managerId },
      relations: ['orders'],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 5,
  ): Promise<{ items: UserBaseResDto[]; totalItems: number }> {
    const validPage = page > 0 ? Number(page) : 1;
    const validLimit = limit > 0 ? Number(limit) : 5;

    const skip = (validPage - 1) * validLimit;

    const [users, totalItems] = await this.usersRepository.findAndCount({
      order: { id: 'desc' },
      take: validLimit,
      skip: skip,
    });

    const items = users.map((user) => UserMapper.toResDto(user));

    return { items, totalItems };
  }

  async disable(idToBan: number, currentUser: UserResDto): Promise<UserResDto> {
    if (currentUser.role !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(`Only admin can ban users`);
    }
    if (!idToBan) {
      throw new NotFoundException(`User with id ${idToBan} not found`);
    }
    if (idToBan === currentUser.id) {
      throw new ForbiddenException(`You cannot Ban yourself`);
    }

    const targetUser = await this.usersRepository.findOneBy({ id: idToBan });
    if (!targetUser) {
      throw new NotFoundException(
        `User with id ${idToBan} not found in database`,
      );
    }

    targetUser.isActive = false;
    const updatedUser = await this.usersRepository.save(targetUser);

    return UserMapper.toResDto(updatedUser);
  }

  async enable(
    idToEnable: number,
    currentUser: UserResDto,
  ): Promise<UserResDto> {
    if (currentUser.role !== UserRoleEnum.ADMIN) {
      throw new BadRequestException(`Only admin can enable users`);
    }
    if (!idToEnable) {
      throw new NotFoundException(`User with id ${idToEnable} not found`);
    }
    if (idToEnable === currentUser.id) {
      throw new ForbiddenException(`You cannot Unban yourself`);
    }

    const targetUser = await this.usersRepository.findOneBy({ id: idToEnable });
    if (!targetUser) {
      throw new NotFoundException(
        `User with id ${idToEnable} not found in database`,
      );
    }

    targetUser.isActive = true;
    const updatedUser = await this.usersRepository.save(targetUser);

    return UserMapper.toResDto(updatedUser);
  }
}