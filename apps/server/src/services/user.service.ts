import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const { User } = require('../Entities/user.entity');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<typeof User>,
  ) {}

  async findAll(): Promise<typeof User[]> {
    return this.userRepository.find();
  }

  async create(user: typeof User): Promise<typeof User> {
    return this.userRepository.save(user);
  }
}