import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Debtor } from './debtor.entity';
import { PeriodDebt } from './periodDebt.entity';
import { ImagesDebt } from './imagesDebt.entity';
import { DebtPeriod } from 'src/common/enum/debt.enum';

@Entity('debt')
export class Debt extends BaseEntity {
  @Column()
  product: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: DebtPeriod })
  period: DebtPeriod;

  @Column('decimal')
  sum: number;

  @Column()
  description: string;

  @ManyToOne(() => Debtor, (debtor) => debtor.debts)
  debtor: Debtor;

  @OneToMany(() => ImagesDebt, (images) => images.debtId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: ImagesDebt[];

  @OneToMany(() => PeriodDebt, (periods) => periods.debt, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  periods: PeriodDebt[];
}
