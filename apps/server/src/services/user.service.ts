import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}