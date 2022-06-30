import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { JobStatus } from './job.enum';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;
  let repository: Repository<Job>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Job])],
      providers: [JobService],
    })
      .overrideProvider(getRepositoryToken(Job))
      .useValue({
        findOne: jest.fn(() => Job),
        update: jest.fn(() => Job),
        save: jest.fn(() => Job),
        find: jest.fn(() => Job),
      })
      .compile();

    service = module.get<JobService>(JobService);
    repository = module.get(getRepositoryToken(Job));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  const userId = 'xxxxxxxxxxx';
  const jobId = 1;
  const jobObject = {
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    id: 1,
    title: 'Full Stack Developer',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    location: 'Kuala Lumpur',
    status: JobStatus.active,
    userId: 'xxzxxx',
    user: null,
  };

  describe('createJob', () => {
    it('should be success', async () => {
      const createJobObject = Object.assign({}, jobObject, { userId });
      jest.spyOn(repository, 'save').mockResolvedValue(createJobObject);
      const result = await service.createJob(jobObject, userId);
      expect(result).toEqual(expect.objectContaining(createJobObject));
    });
  });

  describe('getJob', () => {
    it('should hit Job does not exist error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.getJob(jobId)).rejects.toEqual(
        new Error('Job does not exist'),
      );
    });

    it('should be a success', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(jobObject);
      const result = await service.getJob(jobId);
      expect(result).toEqual(expect.objectContaining(jobObject));
    });
  });

  describe('getJobsByUserId', () => {
    const tempJobObject = Object.assign({}, jobObject, {
      userId,
    });

    it('should be success but empty array', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      const result = await service.getJobsByUserId({ status: null }, userId);
      expect(result).toEqual([]);
    });

    it('should be a success', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([tempJobObject]);
      const result = await service.getJobsByUserId({ status: null }, userId);

      expect(result[0]).toEqual(expect.objectContaining(tempJobObject));
    });

    it('should be a success with inactive status', async () => {
      const inactiveJobObject = Object.assign({}, tempJobObject, {
        status: JobStatus.inactive,
      });
      jest.spyOn(repository, 'find').mockResolvedValue([inactiveJobObject]);
      const result = await service.getJobsByUserId(
        {
          status: JobStatus.inactive,
        },
        userId,
      );

      expect(result[0]).toEqual(expect.objectContaining(inactiveJobObject));
    });
  });

  describe('getJobs', () => {
    it('should be success but empty array', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      const result = await service.getJobs({ status: null });
      expect(result).toEqual([]);
    });

    it('should be a success', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([jobObject]);
      const result = await service.getJobs({ status: null });

      expect(result[0]).toEqual(expect.objectContaining(jobObject));
    });

    it('should be a success with inactive status', async () => {
      const inactiveJobObject = Object.assign({}, jobObject, {
        status: JobStatus.inactive,
      });
      jest.spyOn(repository, 'find').mockResolvedValue([inactiveJobObject]);
      const result = await service.getJobs({ status: JobStatus.inactive });

      expect(result[0]).toEqual(expect.objectContaining(inactiveJobObject));
    });
  });

  describe('updateJob', () => {
    const title = '123123';
    const tempJobObject = Object.assign({}, jobObject, {
      userId,
      title,
    });

    it('should hit Job does not exist error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateJob(jobId, { title: '123123' }, userId),
      ).rejects.toEqual(new Error('Job does not exist'));
    });

    it('should be success', async () => {
      const updateJobObject = Object.assign({}, jobObject, {
        userId,
      });
      jest.spyOn(repository, 'findOne').mockResolvedValue(updateJobObject);
      jest.spyOn(repository, 'update');

      const result = await service.updateJob(
        jobId,
        { title: '123123' },
        userId,
      );

      expect(result).toEqual(expect.objectContaining(tempJobObject));
    });
  });
});
