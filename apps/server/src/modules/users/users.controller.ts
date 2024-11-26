import {
  Controller,
  Get,
  Param,
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

interface AuthenticatedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    email: string;
    // ... other user properties
  };
}

interface OnBoardingRequest extends Request {
  user: {
    _id: Types.ObjectId;
  };
}

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

  @Get("email/:email")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getUserByEmail(@Param("email") email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get("id/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getUserById(@Param("id") userId: string) {
    this.validateUserId(userId);
    return this.usersService.findOne(userId);
  }

  @Get("instruments")
  @ApiOkResponse({ type: [String] })
  async getInstruments(): Promise<string[]> {
    return Object.values(Instrument);
  }

  @Get("onboarding-status")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getOnboardingStatus(@Request() req: OnBoardingRequest) {
    this.validateUserId(req.user._id.toString());
    return this.usersService.getOnboardingStatus(req.user._id.toString());
  }

  @Post("onboarding")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async completeOnboarding(
    @Body() onboardingDto: OnboardingDto,
    @Request() req: OnBoardingRequest,
  ) {
    this.validateUserId(req.user._id.toString());
    return this.usersService.completeOnboarding(req.user._id.toString(), onboardingDto);
  }
}
