import { PickType } from '@nestjs/swagger';
import { IUsersRequestDto } from './users.req.dto';

export class UpdateUserReqDto extends PickType(IUsersRequestDto, ['name']) {}
