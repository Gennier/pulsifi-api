import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { JobStatus } from './job.enum';

export class JobDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsEnum(JobStatus)
  status: JobStatus;
}

export class CreateJobDto extends PickType(JobDto, [
  'title',
  'description',
  'location',
  'status',
] as const) {}

export class UpdateJobDto extends PartialType(JobDto) {}

export class GetJobsFilterDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status: JobStatus;
}
