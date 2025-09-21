import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Debtor } from './debtor.entity';
import { SampleMessage } from './sampleMessage.entity';
import { MessageStatus } from 'src/common/enum/message.enum';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  sampleMessageId?: string;

  @Column({ type: 'uuid' })
  debtorId: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @ManyToOne(() => SampleMessage, (sampleMessage) => sampleMessage.message)
  @JoinColumn({ name: 'sampleMessageId' })
  sampleMessage: SampleMessage;

  @ManyToOne(() => Debtor, (debtor) => debtor.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debtorId' })
  debtor: Debtor;
}
