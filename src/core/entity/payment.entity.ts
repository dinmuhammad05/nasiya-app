import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PeriodDebt } from './periodDebt.entity';

@Entity('payment')
export class Payment extends BaseEntity {
  @Column('integer')
  sum: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => PeriodDebt, (periodDebt) => periodDebt.payment, {
    onDelete: 'CASCADE',
  })
  periodDebt: PeriodDebt;
}
