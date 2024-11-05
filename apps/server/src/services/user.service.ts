import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    console.log('Fetched users:', users);
    return users;
  }

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}