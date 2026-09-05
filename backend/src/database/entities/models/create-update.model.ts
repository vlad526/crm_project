import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateUpdateModel {
  @CreateDateColumn({ type: 'datetime', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at?: Date;
}
