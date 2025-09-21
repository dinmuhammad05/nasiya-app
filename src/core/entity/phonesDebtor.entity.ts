import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Debtor } from './debtor.entity';

@Entity('phonesDebtor')
export class PhonesDebtor extends BaseEntity {
  @Column()
  phoneNumber: string;

  @ManyToOne(() => Debtor, (debtor) => debtor.phoneDebtor)
  debtorId: Debtor;
}
