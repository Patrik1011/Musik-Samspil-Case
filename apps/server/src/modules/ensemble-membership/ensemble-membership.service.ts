import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { Types } from "mongoose";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { CreateEnsembleMembershipDto } from "./dto/create-ensemble-membership.dto";

@Injectable()
export class EnsembleMembershipService {
  async create(createEnsembleMembershipDto: CreateEnsembleMembershipDto) {
    try {
      const membership = await EnsembleMembership.create({
        ensemble: new Types.ObjectId(createEnsembleMembershipDto.ensemble_id),
        ensemble_id: createEnsembleMembershipDto.ensemble_id,
        member: new Types.ObjectId(createEnsembleMembershipDto.member_id),
        member_id: createEnsembleMembershipDto.member_id,
        is_host: createEnsembleMembershipDto.is_host,
      });

      return membership.populate(["ensemble", "member"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findEnsembleMembershipsByEnsemble(ensembleId: string) {
    try {
      return await EnsembleMembership.find({ ensemble_id: ensembleId }).populate([
        "ensemble",
        "member",
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findEnsembleMembershipsByUser(userId: string) {
    try {
      return await EnsembleMembership.find({ member_id: userId }).populate(["ensemble", "member"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const membership = await EnsembleMembership.findById(id);
      if (!membership) {
        throw new NotFoundException(`EnsembleMembership with id ${id} not found`);
      }
      await membership.deleteOne();
      return membership;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const membership = await EnsembleMembership.findById(id).populate(["ensemble", "member"]);
      if (!membership) {
        throw new NotFoundException(`EnsembleMembership with id ${id} not found`);
      }
      return membership;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
