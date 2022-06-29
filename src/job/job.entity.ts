import { AbstractEntity } from '../shared/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn, DeepPartial } from 'typeorm';
import { JobStatus } from './job.enum';

@Entity('job')
export class Job extends AbstractEntity {
  constructor(input?: DeepPartial<Job>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.active,
  })
  status: JobStatus;
}
