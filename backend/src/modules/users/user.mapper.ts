import { UserEntity } from '../../database/entities/user.entity';
import { UserResDto } from './models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: Boolean(user.isActive),
      isBanned: Boolean(user.isBanned),
      lastLogin: user.lastLogin,
      last_login: user.lastLogin,
    } as any;
  }
}