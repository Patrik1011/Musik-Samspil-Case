import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { User } from "../../schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import { OnboardingDto } from "./dto/onboarding.dto";
import { Types } from "mongoose";
import { GeocodingService } from "../geocoding/geocoding.service";

@Injectable()
export class UsersService {
  constructor(private readonly geocodingService: GeocodingService) {}

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

    let locationUpdate = {};
    if (updateUserDto.location) {
      const { latitude, longitude } = await this.geocodingService.geocodeAddress(
        `${updateUserDto.location.address}, ${updateUserDto.location.city}, ${updateUserDto.location.country}`,
      );

      locationUpdate = {
        location: {
          ...updateUserDto.location,
          coordinates: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...updateUserDto,
          ...locationUpdate,
        },
      },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} was not found`);
    }
    return user;
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.validateAndGetUser(userId);
    console.log(user);
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

  async deleteUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    await User.findByIdAndDelete(userId);
  }
}
