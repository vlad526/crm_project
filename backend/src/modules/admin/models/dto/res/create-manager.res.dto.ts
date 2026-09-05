import { PickType } from '@nestjs/swagger';
import { ManagerResDto } from './manager.res.dto';

export class CreateManagerResDto extends PickType(ManagerResDto, [
  'email',

  'password',

  'username',

  'name',

  'surname',

  'role',
]) {}
