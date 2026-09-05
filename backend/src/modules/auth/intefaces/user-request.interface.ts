import { Request } from 'express';
import { IJwtPayload } from './jwt-payload.interface';

export interface UserRequest extends Request {
  user?: IJwtPayload;
}
