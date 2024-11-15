import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse } from "@nestjs/swagger";
import { UserEntity } from "./entity/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserEntity] })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get("email/:email")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async getUserByEmail(@Param("email") email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }

  @Get("id/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async getUserById(@Param("id") userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
