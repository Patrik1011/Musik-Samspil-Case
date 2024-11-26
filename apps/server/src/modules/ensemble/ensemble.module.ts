import { Module } from "@nestjs/common";
import { EnsembleController } from "./ensemble.controller";
import { EnsembleService } from "./ensemble.service";

@Module({
  controllers: [EnsembleController],
  providers: [EnsembleService],
  exports: [EnsembleService],
})
export class EnsembleModule {}
