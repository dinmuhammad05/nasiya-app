import { Column, Entity, OneToMany } from 'typeorm';
import { SampleMessage } from './sampleMessage.entity';
import { Debtor } from './debtor.entity';
import { BaseEntity } from 'src/common/database/base.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';

@Entity('store')
export class Store extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: true })
  login: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  fullName: string;

  @Column('decimal', { default: 0 })
  wallet: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @Column({
    type: 'enum',
    enum: AccessRoles,
    default: AccessRoles.STORE,
    nullable: true,
  })
  role: AccessRoles.STORE;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  otpCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date | null;

  @OneToMany(() => Debtor, (debtors) => debtors.store, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debtors: Debtor[];

  @OneToMany(() => SampleMessage, (sampleMessages) => sampleMessages.store, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sampleMessages: SampleMessage[];
}
