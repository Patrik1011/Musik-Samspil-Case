import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { EnsembleMembershipService } from './ensemble-membership.service';
import { CreateEnsembleMembershipDto } from './dto/create-ensemble-membership.dto';
import { UpdateEnsembleMembershipDto } from './dto/update-ensemble-membership.dto';
import { EnsembleMembership } from '@prisma/client';

@Controller('ensemble-membership')
export class EnsembleMembershipController {
  constructor(private readonly ensembleMembershipService: EnsembleMembershipService) {}

  @Post()
  async create(@Body(ValidationPipe) createEnsembleMembershipDto: CreateEnsembleMembershipDto): Promise<EnsembleMembership> {
    return this.ensembleMembershipService.create(createEnsembleMembershipDto);
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
