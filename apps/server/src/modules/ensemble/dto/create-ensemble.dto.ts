import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnsembleDto {
  @IsString()
    @IsNotEmpty()
    name!: string;

  @IsString()
    @IsNotEmpty()
    description!: string;

  @IsOptional()
  location?: any;

  @IsOptional()
  openPositions?: string[];

  @IsBoolean()
    isActive!: boolean;
}
