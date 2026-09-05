import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../../../database/entities/enums/user-role.enum';

import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { UserRequest } from '../intefaces/user-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<UserRequest>();

    const role = request.user?.role;

    if (!role) {
      return false;
    }

    return requiredRoles.includes(role);
  }
}
