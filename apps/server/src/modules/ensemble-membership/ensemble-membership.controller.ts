import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { EnsembleMembership } from '@prisma/client';
import { CreateEnsembleMembershipDto } from './dto/create-ensemble-membership.dto';
import { EnsembleMembershipService } from './ensemble-membership.service';

@Controller('ensemble-membership')
export class EnsembleMembershipController {
  constructor(private readonly ensembleMembershipService: EnsembleMembershipService) {}

  @Post()
  async create(@Body(ValidationPipe) createEnsembleMembershipDto: CreateEnsembleMembershipDto): Promise<EnsembleMembership> {
      return this.ensembleMembershipService.create(createEnsembleMembershipDto);
  }

 
  @Get(':ensembleId')
  async getMembershipsByEnsemble(@Param('ensembleId') ensembleId: string): Promise<EnsembleMembership[]> {
    return this.ensembleMembershipService.findEnsembleMembershipsByEnsemble(ensembleId);
  }


  // @Get()
  // async findAll() {
  //   return this.ensembleMembershipService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.ensembleMembershipService.findOne(id);
  // }

  // @Get('ensemble/:ensembleId')
  // async getMembershipsByEnsemble(@Param('ensembleId') ensembleId: string) {
  //   return this.ensembleMembershipService.findMembershipsByEnsemble(ensembleId);
  // }

  // @Get('user/:userId')
  // async getMembershipsByUser(@Param('userId') userId: string) {
  //   return this.ensembleMembershipService.findMembershipsByUser(userId);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateEnsembleMembershipDto: UpdateEnsembleMembershipDto) {
  //   return this.ensembleMembershipService.update(id, updateEnsembleMembershipDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.ensembleMembershipService.remove(id);
  // }
}
