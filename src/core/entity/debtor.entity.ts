import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Store } from './store.entity';
import { ImagesDebtor } from './imagesDebtor.entity';
import { PhonesDebtor } from './phonesDebtor.entity';
import { Message } from './message.entity';
import { Debt } from './debt.entity';

@Entity('debtor')
export class Debtor extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Store, (store) => store.debtors)
  store: Store;

  @OneToMany(() => Message, (messages) => messages.debtorId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  messages: Message[];

  @OneToMany(() => Debt, (debts) => debts.debtor, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debts: Debt[];

  @OneToMany(() => PhonesDebtor, (phoneDebtor) => phoneDebtor.debtorId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  phoneDebtor: PhonesDebtor[];

  @OneToMany(() => ImagesDebtor, (imagesDebtor) => imagesDebtor.debtorId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  imagesDebtor: ImagesDebtor[];
}
