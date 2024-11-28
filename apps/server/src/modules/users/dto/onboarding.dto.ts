import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OnboardingDto {
  @IsString()
  @ApiProperty({ required: true })
  phone_number!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio?: string;
}
