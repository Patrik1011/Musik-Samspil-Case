import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

@Injectable()
export class EnsembleMembershipService {
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
}
