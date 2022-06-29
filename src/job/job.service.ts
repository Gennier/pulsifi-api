import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto, JobDto, UpdateJobDto } from './job.dto';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    protected readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(input: CreateJobDto): Promise<JobDto> {
    return await this.jobRepository.save({
      ...input,
    });
  }

  async getJob(id: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id,
      },
    });

    if (!job) {
      throw new Error('Job does not exist');
    }

    return job;
  }

  async getJobs() {
    return await this.jobRepository.find();
  }

  async updateJob(id: number, input: UpdateJobDto): Promise<JobDto> {
    const job = await this.jobRepository.findOne({
      where: {
        id,
      },
    });

    if (!job) {
      throw new Error('Job does not exist');
    }

    const updateData = Object.assign(job, { ...input });

    await this.jobRepository.update(id, updateData);

    return updateData;
  }
}
