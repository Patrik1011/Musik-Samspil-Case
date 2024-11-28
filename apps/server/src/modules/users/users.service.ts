import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { User } from "../../schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OnboardingDto } from "./dto/onboarding.dto";
import { Types } from "mongoose";

@Injectable()
export class UsersService {
  private async validateAndGetUser(userId: string) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }

  async findOne(userId: string) {
    return this.validateAndGetUser(userId);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    const user = await User.findByIdAndUpdate(userId, { $set: updateUserDto }, { new: true });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.validateAndGetUser(userId);
    const isOnboarded = !!user.phone_number;
    return { onboarded: isOnboarded };
  }

  async completeOnboarding(userId: string, onboardingDto: OnboardingDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    const user = await User.findByIdAndUpdate(userId, { $set: onboardingDto }, { new: true });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }
}
