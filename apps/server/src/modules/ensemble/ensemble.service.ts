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

@Injectable()
export class EnsembleService {
  async create(createEnsembleDto: CreateEnsembleDto) {
    try {
      const ensemble = await Ensemble.create({
        name: createEnsembleDto.name,
        description: createEnsembleDto.description,
        location: createEnsembleDto.location ?? null,
        open_positions: createEnsembleDto.openPositions || [],
        is_active: createEnsembleDto.isActive,
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
}
