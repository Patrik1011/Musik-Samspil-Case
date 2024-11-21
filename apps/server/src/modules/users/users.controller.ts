import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse } from "@nestjs/swagger";
import { UserEntity } from "./entity/user.entity";
import { OnboardingDto } from "./dto/onboarding.dto";

interface OnBoardingRequest extends Request {
  user: {
    id: string;
  };
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private validateUserId(userId: string): void {
    if (!userId) {
      throw new Error("User id not found in request");
    }
  }

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

  @Get("onboarding-status")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getOnboardingStatus(@Request() req: OnBoardingRequest): Promise<{ onboarded: boolean }> {
    this.validateUserId(req.user.id);
    return this.usersService.getOnboardingStatus(req.user.id);
  }

  @Post("onboarding")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async completeOnboarding(
    @Body() onboardingDto: OnboardingDto,
    @Request() req: OnBoardingRequest,
  ): Promise<User> {
    this.validateUserId(req.user.id);
    return this.usersService.completeOnboarding(req.user.id, onboardingDto);
  }
}
