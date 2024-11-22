import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Ensemble, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';

@Injectable()
export class EnsembleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEnsembleDto: CreateEnsembleDto): Promise<Ensemble> {
    try {
      return await this.prismaService.ensemble.create({
        data: {
          name: createEnsembleDto.name,
          description: createEnsembleDto.description,
          location: createEnsembleDto.location || null,
          open_positions: createEnsembleDto.openPositions || [],
          is_active: createEnsembleDto.isActive,
        },
      });
    } 
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Ensemble with this name already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create ensemble');
    }
  }

  async findAll(): Promise<Ensemble[]> {
    try {
      return await this.prismaService.ensemble.findMany({
        include: {memberships: true}
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch ensembles');
    }
  }

  async findOne(id: string): Promise<Ensemble> {
    try {
      const ensemble = await this.prismaService.ensemble.findUnique({
        where: { id },
        include: {memberships: true}
      });
      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return ensemble;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch ensemble');
    }
  }

  async update(id: string, updateEnsembleDto: UpdateEnsembleDto): Promise<Ensemble> {
    try {
      const ensemble = await this.prismaService.ensemble.findUnique({
        where: { id },
      });
      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return await this.prismaService.ensemble.update({
        where: { id },
        data: updateEnsembleDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update ensemble');
    }
  }

  async delete(id: string): Promise<Ensemble> {
    try {
      const ensemble = await this.prismaService.ensemble.findUnique({
        where: { id },
      });
      if (!ensemble) {
        throw new NotFoundException(`Ensemble with id ${id} not found`);
      }
      return await this.prismaService.ensemble.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete ensemble');
    }
  }
}
