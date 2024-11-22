import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EnsembleMembership } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEnsembleMembershipDto } from "./dto/create-ensemble-membership.dto";

@Injectable()
export class EnsembleMembershipService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createEnsembleMembershipDto: CreateEnsembleMembershipDto,
  ): Promise<EnsembleMembership> {
    try {
      return await this.prismaService.ensembleMembership.create({
        data: {
          ensemble_id: createEnsembleMembershipDto.ensemble_id,
          member_id: createEnsembleMembershipDto.member_id,
          is_host: createEnsembleMembershipDto.is_host,
        },
      });
    } catch (error) {
      console.error("Error creating ensemble membership:", error);
      throw new Error("Failed to create ensemble membership");
    }
  }

  async findEnsembleMembershipsByEnsemble(ensembleId: string): Promise<EnsembleMembership[]> {
    return this.prismaService.ensembleMembership.findMany({
      where: { ensemble_id: ensembleId },
    });
  }

  // async findAll() {
  //   return `This action returns all ensembleMembership`;
  // }

  // async findOne(id: number) {
  //   return `This action returns a #${id} ensembleMembership`;
  // }

  // async update(id: number, updateEnsembleMembershipDto: UpdateEnsembleMembershipDto) {
  //   return `This action updates a #${id} ensembleMembership`;
  // }

  async remove(id: string): Promise<EnsembleMembership> {
    try {
      const ensembleMembership = await this.prismaService.ensemble.findUnique({
        where: { id },
      });
      if (!ensembleMembership) {
        throw new NotFoundException(`EnsembleMembership with id ${id} not found`);
      }
      return await this.prismaService.ensembleMembership.delete({
        where: { id },
      });
    } catch {
      throw new InternalServerErrorException("Failed to delete ensemble");
    }
  }
}
