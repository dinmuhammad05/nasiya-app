import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';

@Entity('sampleMessage')
export class SampleMessage extends BaseEntity {
  @Column()
  message: string;

  @ManyToOne(() => Store, (store) => store.sampleMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ type: 'uuid' })
  storeId: string;
}
