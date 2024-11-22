import { PartialType } from '@nestjs/swagger';
import { CreateEnsembleMembershipDto } from './create-ensemble-membership.dto';

export class UpdateEnsembleMembershipDto extends PartialType(CreateEnsembleMembershipDto) {}
