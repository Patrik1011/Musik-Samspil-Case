import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
  Delete,
} from "@nestjs/common";

import { ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { Types } from "mongoose";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateEnsembleMembershipDto } from "./dto/create-ensemble-membership.dto";
import { EnsembleMembershipService } from "./ensemble-membership.service";

@Controller("ensemble-membership")
@ApiTags("ensemble-membership")
export class EnsembleMembershipController {
  constructor(private readonly ensembleMembershipService: EnsembleMembershipService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async create(@Body() createEnsembleMembershipDto: CreateEnsembleMembershipDto) {
    if (
      !Types.ObjectId.isValid(createEnsembleMembershipDto.ensemble_id) ||
      !Types.ObjectId.isValid(createEnsembleMembershipDto.member_id)
    ) {
      throw new BadRequestException("Invalid ensemble or member ID");
    }
    return this.ensembleMembershipService.create(createEnsembleMembershipDto);
  }

  @Get("ensemble/:ensembleId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getMembershipsByEnsemble(@Param("ensembleId") ensembleId: string) {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new BadRequestException("Invalid ensemble ID");
    }
    return this.ensembleMembershipService.findEnsembleMembershipsByEnsemble(ensembleId);
  }

  @Get("user/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getMembershipsByUser(@Param("userId") userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    return this.ensembleMembershipService.findEnsembleMembershipsByUser(userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async remove(@Param("id") id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid membership ID");
    }
    return this.ensembleMembershipService.remove(id);
  }
}
