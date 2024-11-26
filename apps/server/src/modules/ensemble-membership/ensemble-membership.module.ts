import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { EnsembleMembershipController } from "./ensemble-membership.controller";
import { EnsembleMembershipService } from "./ensemble-membership.service";

@Module({
  imports: [PrismaModule],
  controllers: [EnsembleMembershipController],
  providers: [EnsembleMembershipService],
  exports: [EnsembleMembershipService],
})
export class EnsembleMembershipModule {}
