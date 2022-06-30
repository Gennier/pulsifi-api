import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateJobDto,
  GetJobsFilterDto,
  JobDto,
  UpdateJobDto,
} from './job.dto';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    protected readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(input: CreateJobDto, userId: string): Promise<JobDto> {
    return await this.jobRepository.save({
      ...input,
      userId,
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

  async getJobsByUserId(filter: GetJobsFilterDto, userId: string) {
    const { status } = filter;
    return await this.jobRepository.find({
      where: {
        ...(status && {
          status,
        }),
        userId,
      },
    });
  }

  async getJobs(filter: GetJobsFilterDto) {
    const { status } = filter;
    return await this.jobRepository.find({
      where: {
        ...(status && {
          status,
        }),
      },
    });
  }

  async updateJob(
    id: number,
    input: UpdateJobDto,
    userId: string,
  ): Promise<JobDto> {
    const job = await this.jobRepository.findOne({
      where: {
        id,
        userId,
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
