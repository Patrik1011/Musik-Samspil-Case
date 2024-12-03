import { Module } from "@nestjs/common";
import { EnsembleController } from "./ensemble.controller";
import { EnsembleService } from "./ensemble.service";
import { GeocodingService } from "../geocoding/geocoding.service";

@Module({
  controllers: [EnsembleController],
  providers: [EnsembleService, GeocodingService],
  exports: [EnsembleService],
})
export class EnsembleModule {}
