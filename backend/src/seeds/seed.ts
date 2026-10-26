import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { UserEntity } from '../database/entities/user.entity';
import { EnvService } from '../shared/env.service';
import { UserRoleEnum } from '../database/entities/enums/user-role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );
  const envService = app.get(EnvService);
  const adminEmail = envService.adminEmail || 'admin@gmail.com';
  const adminPassword = envService.adminPassword || 'admin';

  const adminExists = await userRepo.findOne({
    where: { email: adminEmail },
    select: ['id'],
  });

  if (!adminExists) {
    const admin = userRepo.create({
      email: adminEmail,
      password: adminPassword,
      role: UserRoleEnum.ADMIN,
      username: 'admin',
      name: 'Admin',
      surname: 'System',
      isActive: true,
    });

    await userRepo.save(admin);
    console.log(`Admin seeded successfully! Email: ${adminEmail} | Password: ${adminPassword}`);
  } else {
    await userRepo.update({ email: adminEmail }, { isActive: true });
    console.log('Admin already exists, skipping seed');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});