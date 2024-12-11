import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

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
}
