import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
  Body,
  BadRequestException,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OnboardingDto } from "./dto/onboarding.dto";
import { Types } from "mongoose";
import { Instrument } from "../../utils/types/enums";
import { AuthenticatedRequest } from "../../utils/interfaces/AuthenticatedRequest";
import { OnboardingRequest } from "../../utils/interfaces/OnboardingRequest";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private validateUserId(userId: string): void {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getCurrentUser(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
    if (!req.user._id) {
      throw new BadRequestException("User ID is required");
    }
    return this.usersService.updateUser(req.user._id.toString(), updateUserDto);
  }

  @Get("instruments")
  @ApiOkResponse({ type: [String] })
  async getInstruments(): Promise<string[]> {
    return Object.values(Instrument);
  }

  @Get("onboarding-status")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getOnboardingStatus(@Request() req: OnboardingRequest) {
    this.validateUserId(req.user._id.toString());
    return this.usersService.getOnboardingStatus(req.user._id.toString());
  }

  @Post("onboarding")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async completeOnboarding(
    @Body() onboardingDto: OnboardingDto,
    @Request() req: OnboardingRequest,
  ) {
    this.validateUserId(req.user._id.toString());
    return this.usersService.completeOnboarding(req.user._id.toString(), onboardingDto);
  }
}
