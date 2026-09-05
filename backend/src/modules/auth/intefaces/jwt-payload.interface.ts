import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

export interface IJwtPayload {
  userId: number;
  username: string;
  role: UserRoleEnum;
  jti: string;
}
