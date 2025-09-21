import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { PeriodDebt } from './periodDebt.entity';

@Entity('payment')
export class Payment extends BaseEntity {
  @Column('decimal')
  sum: number;

  @Column({ type: 'date' })
  date: Date;

  @OneToOne(() => PeriodDebt, (period) => period.payment)
  period: Payment;
}
