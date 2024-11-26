import { Module } from "@nestjs/common";
import { EnsembleMembershipController } from "./ensemble-membership.controller";
import { EnsembleMembershipService } from "./ensemble-membership.service";

@Module({
  controllers: [EnsembleMembershipController],
  providers: [EnsembleMembershipService],
  exports: [EnsembleMembershipService],
})
export class EnsembleMembershipModule {}
