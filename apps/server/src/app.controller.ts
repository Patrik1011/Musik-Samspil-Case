import { Controller, Get } from '@nestjs/common';
const { AppService } = require('./app.service');
const { UserService } = require('./services/user.service');
const { User } = require('./Entities/user.entity');

@Controller()
export class AppController {
  constructor(
    private readonly appService: typeof AppService,
    private readonly userService: typeof UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getAllUsers(): Promise<typeof User[]> {
    return this.userService.findAll();
  }
}
