import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsString, IsEnum } from "class-validator";
import { Instrument } from "../../../utils/types/enums";

interface Location {
  city: string;
  country: string;
  address: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
}

export class CreateEnsembleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsObject()
  @IsNotEmpty()
  location!: Location;

  @IsArray()
  @IsEnum(Instrument, { each: true })
  open_positions?: Instrument[];

  @IsBoolean()
  @IsNotEmpty()
  is_active!: boolean;
}
