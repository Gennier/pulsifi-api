import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async getUser(id: string) {
    const job = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!job) {
      throw new Error('User does not exist');
    }

    return job;
  }

  async getUsers() {
    return await this.userRepository.find();
  }
}
