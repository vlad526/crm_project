import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';

@Entity(TableNameEnum.TOKENS)
export class TokenEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'datetime', precision: 6 })
  accessTokenExpiresAt: Date;

  @Column({ type: 'datetime', precision: 6 })
  refreshTokenExpiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ unique: true })
  jti: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
