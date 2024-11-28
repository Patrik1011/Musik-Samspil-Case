import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsString } from "class-validator";

interface Location {
  type: string;
  coordinates: string[];
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
  @IsString({ each: true })
  @IsNotEmpty()
  open_positions?: string[];

  @IsBoolean()
  @IsNotEmpty()
  is_active!: boolean;
}
