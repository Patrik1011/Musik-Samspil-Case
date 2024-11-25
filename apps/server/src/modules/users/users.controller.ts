import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Put,
  Body,
  BadRequestException,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse } from "@nestjs/swagger";
import { UserEntity } from "./entity/user.entity";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Instrument } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // @ApiOkResponse({ type: [UserEntity] })
  // async getAllUsers(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async getCurrentUser(@Request() req: AuthenticatedRequest): Promise<User> {
    return req.user;
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    if (!req.user.id) {
      throw new BadRequestException("User ID is required");
    }
    return this.usersService.updateUser(req.user.id, updateUserDto);
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

  @Get("instruments")
  @ApiOkResponse({ type: [String] })
  async getInstruments(): Promise<string[]> {
    return Object.values(Instrument);
  }
}
