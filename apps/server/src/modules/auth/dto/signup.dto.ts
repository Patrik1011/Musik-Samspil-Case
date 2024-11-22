import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  first_name?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  last_name?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password!: string;
}
