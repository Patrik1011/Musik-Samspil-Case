import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, IsEnum } from "class-validator";
import { Instrument } from "../../../utils/types/enums";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false })
  first_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ required: false })
  last_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  bio?: string;

  @IsOptional()
  @IsEnum(Instrument)
  @ApiProperty({ required: false, enum: Instrument })
  instrument?: Instrument;
}
