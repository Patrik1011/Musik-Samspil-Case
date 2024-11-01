import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    console.log('Fetched users:', users);
    return users;
  }

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}