import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserEntity } from "./entity/user.entity";
import { ObjectId } from "mongodb";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    this.logger.log(`Retrieved ${users.length} users`);
    return users;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email: ${email} was not found`);
    }
    return user;
  }

  async findOne(userId: string): Promise<UserEntity> {
    const objectId = new ObjectId(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: objectId.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    if (!userId) {
      throw new BadRequestException("User ID is required");
    }

    const objectId = new ObjectId(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: objectId.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }

    return this.prisma.user.update({
      where: { id: objectId.toString() },
      data: updateUserDto,
    });
  }
}
