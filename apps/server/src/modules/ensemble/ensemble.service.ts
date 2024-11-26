import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Types } from "mongoose";
import { Ensemble } from "../../schemas/ensemble.schema";
import { CreateEnsembleDto } from "./dto/create-ensemble.dto";
import { UpdateEnsembleDto } from "./dto/update-ensemble.dto";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import mongoose from "mongoose";

@Injectable()
export class EnsembleService {
  // In use
  async findUserHostedEnsembles(userId: string) {
    try {
      const hostMemberships = await EnsembleMembership.find({
        member: new Types.ObjectId(userId),
        is_host: true,
      }).populate("ensemble");

      return hostMemberships.map((membership) => membership.ensemble);
    } catch (error) {
      console.error("Error in findUserHostedEnsembles:", error);
      throw new InternalServerErrorException(error);
    }
  }

  async createWithHost(createEnsembleDto: CreateEnsembleDto, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ensemble = await Ensemble.create([{
        name: createEnsembleDto.name,
        description: createEnsembleDto.description,
        location: createEnsembleDto.location,
        open_positions: createEnsembleDto.openPositions || [],
        is_active: createEnsembleDto.isActive,
      }], { session });

      await EnsembleMembership.create([{
        ensemble: ensemble[0]._id,
        ensemble_id: ensemble[0]._id.toString(),
        member: new mongoose.Types.ObjectId(userId),
        member_id: userId,
        is_host: true,
      }], { session });

      await session.commitTransaction();
      return ensemble[0];
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      session.endSession();
    }
  }
}
