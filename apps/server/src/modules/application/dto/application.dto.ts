import { IsString, IsEnum, IsOptional } from "class-validator";
import { Instrument } from "../../../utils/types/enums";

export class ApplyForPostDto {
  @IsEnum(Instrument)
  instrument!: Instrument;

  @IsString()
  @IsOptional()
  message?: string;
}
