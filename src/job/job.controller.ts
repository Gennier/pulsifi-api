import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreateJobDto, JobDto, UpdateJobDto } from './job.dto';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly service: JobService) {}

  @Get()
  async findJobs(): Promise<JobDto[]> {
    return await this.service.getJobs();
  }

  @Post()
  async createJob(@Body() input: CreateJobDto): Promise<JobDto> {
    return await this.service.createJob(input);
  }

  @Get(':id')
  async findJob(@Param('id') id: number): Promise<JobDto> {
    return await this.service.getJob(id);
  }

  @Put(':id')
  async updateJob(
    @Param('id') id: number,
    @Body() input: UpdateJobDto,
  ): Promise<JobDto> {
    return await this.service.updateJob(id, input);
  }
}
