import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}