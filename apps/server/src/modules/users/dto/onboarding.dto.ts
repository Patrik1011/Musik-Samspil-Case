import { IsString, IsEnum, IsOptional } from "class-validator";
import { Instrument } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger"; // Assuming you have an enum for instruments

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
