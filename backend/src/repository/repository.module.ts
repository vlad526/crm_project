import { Global, Module } from '@nestjs/common';
import { UsersRepository } from './services/users.repository';

const repositories = [UsersRepository];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
