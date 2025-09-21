import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Debtor } from './debtor.entity';

@Entity('imagesDebtor')
export class ImagesDebtor extends BaseEntity {
  @Column({ type: 'varchar', default: '' })
  imageUrl: string;

  @ManyToOne(() => Debtor, (debtor) => debtor.imagesDebtor, {
    onDelete: 'CASCADE',
  })
  @Column()
  debtorId: string;
}
