import { AbstractEntity } from '../shared/entities/abstract.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeepPartial,
  OneToMany,
} from 'typeorm';
import { UserRole, UserStatus } from './user.enum';
import { Job } from '../job/job.entity';

@Entity('user')
export class User extends AbstractEntity {
  constructor(input?: DeepPartial<User>) {
    super(input);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.active })
  status: UserStatus;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.talent })
  role: UserRole;

  @OneToMany(() => Job, (job) => job.user)
  jobs?: Job[];
}
