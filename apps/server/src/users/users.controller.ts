import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiCreatedResponse } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get("email/:email")
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Param("email") email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }

  @Get("id/:id")
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param("id") userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
