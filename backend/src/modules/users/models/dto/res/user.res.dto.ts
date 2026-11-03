import { PickType } from '@nestjs/swagger';
import { UserBaseResDto } from './users-base-res';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'email',
  'role',
  'name',
  'surname',
  'avatarUrl',
  'isActive',
  'isBanned',
  'lastLogin',
  'total_orders',
]) {}