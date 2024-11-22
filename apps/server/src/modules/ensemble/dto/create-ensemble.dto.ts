import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateEnsembleDto {
  @IsString()
    @IsNotEmpty()
    name!: string;

  @IsString()
    @IsNotEmpty()
    description!: string;


    @IsNotEmpty()
  location?: any;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  openPositions?: string[];

  @IsBoolean()
  @IsNotEmpty()
    isActive!: boolean;
}
