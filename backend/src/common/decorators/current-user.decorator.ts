import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../modules/auth/intefaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IJwtPayload => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as IJwtPayload;
  },
);
