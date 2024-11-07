import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { ObjectId } from "mongodb";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    this.logger.log(`Retrieved ${users.length} users`);
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email: ${email} was not found`);
    }
    return user;
  }

  async findOne(userId: string): Promise<User> {
    const objectId = new ObjectId(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: objectId.toString() },
    });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }
}
