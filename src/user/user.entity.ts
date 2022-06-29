import { AbstractEntity } from '../shared/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn, DeepPartial } from 'typeorm';
import { UserStatus } from './user.enum';

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
}
