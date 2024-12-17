import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import mongoose, { Types } from "mongoose";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { Ensemble } from "../../schemas/ensemble.schema";
import { Post } from "../../schemas/post.schema";
import { CreateEnsembleDto } from "./dto/create-ensemble.dto";
import { UpdateEnsembleDto } from "./dto/update-ensemble.dto";
import { GeocodingService } from "../geocoding/geocoding.service";

@Injectable()
export class EnsembleService {
  constructor(private readonly geocodingService: GeocodingService) {}

  async findUserHostedEnsembles(userId: string) {
    try {
      const hostMemberships = await EnsembleMembership.find({
        member: new Types.ObjectId(userId),
        is_host: true,
      })
        .populate([
          {
            path: "ensemble",
          },
          {
            path: "member",
            select: "first_name last_name email instrument",
          },
        ])
        .lean();

      const ensemblesWithMembers = await Promise.all(
        hostMemberships.map(async (hostMembership) => {
          const ensemble = hostMembership.ensemble;
          if (!ensemble) return null;

          const members = await EnsembleMembership.find({
            ensemble: ensemble._id,
          })
            .populate("member", "first_name last_name email instrument")
            .lean();

          return {
            ...ensemble,
            members: members,
          };
        }),
      );

      return ensemblesWithMembers.filter((e) => e !== null);
    } catch (error) {
      console.error("Error in findUserHostedEnsembles:", error);
      throw new InternalServerErrorException(error);
    }
  }

  async createWithHost(createEnsembleDto: CreateEnsembleDto, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { latitude, longitude } = await this.geocodingService.geocodeAddress(
        `${createEnsembleDto.location.address}, ${createEnsembleDto.location.city}, ${createEnsembleDto.location.country}`,
      );

      console.log(latitude, longitude);

      const ensemble = await Ensemble.create(
        [
          {
            name: createEnsembleDto.name,
            description: createEnsembleDto.description,
            location: {
              ...createEnsembleDto.location,
              coordinates: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
            open_positions: createEnsembleDto.open_positions || [],
            is_active: createEnsembleDto.is_active,
          },
        ],
        { session },
      );

      await EnsembleMembership.create(
        [
          {
            ensemble: ensemble[0]._id,
            ensemble_id: ensemble[0]._id.toString(),
            member: new mongoose.Types.ObjectId(userId),
            member_id: userId,
            is_host: true,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return ensemble[0];
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const membership = await EnsembleMembership.findOne({
        ensemble: new Types.ObjectId(id),
        member: new Types.ObjectId(userId),
      });

      if (!membership) {
        throw new ForbiddenException("You don't have access to this ensemble");
      }

      const ensemble = await Ensemble.findById(id);

      if (!ensemble) {
        throw new NotFoundException("Ensemble not found");
      }

      return ensemble;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateEnsembleDto: UpdateEnsembleDto, userId: string) {
    try {
      const membership = await EnsembleMembership.findOne({
        ensemble: new Types.ObjectId(id),
        member: new Types.ObjectId(userId),
        is_host: true,
      });

      if (!membership) {
        throw new ForbiddenException("You don't have permission to update this ensemble");
      }

      const updatedEnsemble = await Ensemble.findByIdAndUpdate(
        id,
        {
          $set: {
            ...(updateEnsembleDto.name && { name: updateEnsembleDto.name }),
            ...(updateEnsembleDto.description && { description: updateEnsembleDto.description }),
            ...(updateEnsembleDto.location && { location: updateEnsembleDto.location }),
            ...(updateEnsembleDto.open_positions && {
              open_positions: updateEnsembleDto.open_positions,
            }),
          },
        },
        { new: true },
      );

      if (!updatedEnsemble) {
        throw new NotFoundException("Ensemble not found");
      }

      return updatedEnsemble;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ensemble = await Ensemble.findById(id);
      if (!ensemble) {
        throw new NotFoundException("Ensemble not found");
      }

      const membership = await EnsembleMembership.findOne({
        ensemble: ensemble._id,
        member: userId,
        is_host: true,
      });

      if (!membership) {
        throw new ForbiddenException("Only ensemble host can delete the ensemble");
      }

      await Post.deleteMany({ ensemble_id: ensemble._id }, { session });
      await EnsembleMembership.deleteMany({ ensemble: ensemble._id }, { session });
      await Ensemble.findByIdAndDelete(id, { session });

      await session.commitTransaction();
      return { message: "Ensemble deleted successfully" };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
