import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Public, Roles, User as CurrentUser } from '../shared/decorators';
import { RolesGuard } from '../shared/guards/roles.guard';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.enum';
import {
  CreateJobDto,
  GetJobsFilterDto,
  JobDto,
  UpdateJobDto,
} from './job.dto';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly service: JobService) {}

  @Public()
  @Get()
  async findJobs(@Query() filter: GetJobsFilterDto): Promise<JobDto[]> {
    return await this.service.getJobs(filter);
  }

  /*
   * (note): To only list our jobs base on user id
   * specifically for recruiter,
   * because we dont want recruiter to see other recruiter jobs in their dashboard
   */

  @UseGuards(RolesGuard)
  @Roles(UserRole.recruiter)
  @Get('me')
  async findJobsByUserId(
    @Query() filter: GetJobsFilterDto,
    @CurrentUser() user: User,
  ): Promise<JobDto[]> {
    return await this.service.getJobsByUserId(filter, user.id);
  }

  /*
   * (note): Only for recruiter to create
   */

  @UseGuards(RolesGuard)
  @Roles(UserRole.recruiter)
  @Post()
  async createJob(
    @CurrentUser() user: User,
    @Body() input: CreateJobDto,
  ): Promise<JobDto> {
    return await this.service.createJob(input, user.id);
  }

  @Get(':id')
  async findJob(@Param('id') id: number): Promise<JobDto> {
    return await this.service.getJob(id);
  }

  /*
   * (note): Only for recruiter to update
   * and only for their own jobs not others
   */

  @UseGuards(RolesGuard)
  @Roles(UserRole.recruiter)
  @Put(':id')
  async updateJob(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() input: UpdateJobDto,
  ): Promise<JobDto> {
    return await this.service.updateJob(id, input, user.id);
  }
}
