import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateUpdateModel } from './models/create-update.model';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity(TableNameEnum.COMMENTS)
export class CommentEntity extends CreateUpdateModel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  text: string;

  @ManyToOne(() => OrderEntity, (order) => order.comments, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
