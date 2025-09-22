import { BaseEntity } from 'src/common/database/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Debt } from './debt.entity';
import { Payment } from './payment.entity';

@Entity('periodDebt')
export class PeriodDebt extends BaseEntity {
  @Column('decimal')
  monthlySum: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal')
  remnant: number;

  @ManyToOne(() => Debt, (debt) => debt.period)
  debt: Debt;

  @OneToOne(() => Payment, (payment) => payment.periodDebt)
  payment: Payment;
}
