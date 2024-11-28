import { IsString, IsOptional, IsObject, IsArray, IsEnum } from "class-validator";
import { Instrument } from "../../../utils/types/enums";

class LocationDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateEnsembleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  location?: LocationDto;

  @IsArray()
  @IsEnum(Instrument, { each: true })
  @IsOptional()
  open_positions?: Instrument[];
}
