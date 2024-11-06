import { Controller, Get, Param } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":email")
  async getUserByEmail(@Param("email") email: string): Promise<User> {
    return this.usersService.getUserByEmail(email);
  }
}
