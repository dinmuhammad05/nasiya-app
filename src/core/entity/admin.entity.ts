import { BaseEntity } from 'src/common/database/base.entity';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { Column, Entity } from 'typeorm';

@Entity('admin')
export class Admin extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'enum', enum: AccessRoles, default: AccessRoles.ADMIN })
  role: AccessRoles;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string;
}
