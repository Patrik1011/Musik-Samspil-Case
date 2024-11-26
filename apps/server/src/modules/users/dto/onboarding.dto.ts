import { IsString, IsEnum, IsOptional } from "class-validator";
import { Instrument } from "../../../utils/types/enums";
import { ApiProperty } from "@nestjs/swagger";

export class OnboardingDto {
  @IsString()
  @ApiProperty({ required: true })
  phone_number!: string;

  @IsEnum(Instrument)
  @ApiProperty({ required: true })
  instrument!: Instrument;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio?: string;
}
