import { ApiProperty } from "@nestjs/swagger";
import { Instrument } from "@prisma/client";

export class UserEntity {
  @ApiProperty()
  id?: string;

  @ApiProperty({ required: false })
  first_name?: string | null;

  @ApiProperty({ required: false })
  last_name?: string | null;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false })
  phone_number?: string | null;

  @ApiProperty({ required: false })
  bio?: string | null;

  @ApiProperty({ required: false })
  instrument?: Instrument | string;
}
