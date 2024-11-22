import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { EnsembleController } from "./ensemble.controller";
import { EnsembleService } from "./ensemble.service";

@Module({
  imports: [PrismaModule],
  controllers: [EnsembleController],
  providers: [EnsembleService],
  exports: [EnsembleService],
})
export class EnsembleModule {}
console.log("EnsembleModule loaded");
