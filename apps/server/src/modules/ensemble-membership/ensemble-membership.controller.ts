import { Controller, Get, Param, UseGuards, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOkResponse } from "@nestjs/swagger";
import { Types } from "mongoose";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { EnsembleMembershipService } from "./ensemble-membership.service";

@Controller("ensemble-membership")
@ApiTags("ensemble-membership")
export class EnsembleMembershipController {
  constructor(private readonly ensembleMembershipService: EnsembleMembershipService) {}

  @Get("ensemble/:ensembleId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getMembershipsByEnsemble(@Param("ensembleId") ensembleId: string) {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new BadRequestException("Invalid ensemble ID");
    }
    return this.ensembleMembershipService.findEnsembleMembershipsByEnsemble(ensembleId);
  }
}
