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

@Injectable()
export class EnsembleService {
  async create(createEnsembleDto: CreateEnsembleDto) {
    try {
      const ensemble = await Ensemble.create({
        name: createEnsembleDto.name,
        description: createEnsembleDto.description,
        location: createEnsembleDto.location ?? null,
        open_positions: createEnsembleDto.open_positions || [],
        is_active: createEnsembleDto.is_active,
      });
      return ensemble;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await Ensemble.find().populate("memberships");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid ensemble ID");
      }

      const ensemble = await Ensemble.findById(id).populate("memberships");
      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return ensemble;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateEnsembleDto: UpdateEnsembleDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid ensemble ID");
      }

      const ensemble = await Ensemble.findByIdAndUpdate(
        id,
        { $set: updateEnsembleDto },
        { new: true },
      );

      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return ensemble;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException("Invalid ensemble ID");
      }

      const ensemble = await Ensemble.findByIdAndDelete(id);
      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return ensemble;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

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
}
