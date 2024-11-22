import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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


}
