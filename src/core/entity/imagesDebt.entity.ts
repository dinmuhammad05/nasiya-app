import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Debt } from './debt.entity';

@Entity('imagesDebt')
export class ImagesDebt extends BaseEntity {
  @Column({})
  imageUrl: string;

  @ManyToOne(() => Debt, (debt) => debt.images)
  debtId: Debt;

  @ManyToOne(() => Debt, (debt) => debt.images)
  debt: Debt;
}
