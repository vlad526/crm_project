import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableNameEnum } from './enums/table-name.enum';
import { OrderEntity } from './order.entity';

@Entity(TableNameEnum.GROUPS)
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;

  @OneToMany(() => OrderEntity, (order) => order.group)
  orders: OrderEntity[];
}
