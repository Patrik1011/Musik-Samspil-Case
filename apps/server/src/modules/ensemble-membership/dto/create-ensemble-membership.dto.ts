import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Instrument } from "../../../utils/types/enums";

export class CreateEnsembleMembershipDto {
  @IsString()
  @IsNotEmpty()
  ensemble_id!: string;

  @IsString()
  @IsNotEmpty()
  member_id!: string;

  @IsBoolean()
  @IsNotEmpty()
  is_host!: boolean;

  @IsEnum(Instrument)
  instrument?: Instrument;
}
