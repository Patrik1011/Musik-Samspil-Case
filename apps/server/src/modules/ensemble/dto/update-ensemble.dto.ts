import { PartialType } from '@nestjs/swagger';
import { CreateEnsembleDto } from './create-ensemble.dto';

export class UpdateEnsembleDto extends PartialType(CreateEnsembleDto) {}
