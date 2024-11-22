import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe
} from '@nestjs/common';
import { Ensemble } from '@prisma/client';
import { CreateEnsembleDto } from './dto/create-ensemble.dto';
import { UpdateEnsembleDto } from './dto/update-ensemble.dto';
import { EnsembleService } from './ensemble.service';

@Controller('ensemble')
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Post()
  create(@Body(ValidationPipe) createEnsembleDto: CreateEnsembleDto): Promise<Ensemble> {
    return this.ensembleService.create(createEnsembleDto);
  }

  @Get()
  findAll(): Promise<Ensemble[]> {
    return this.ensembleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Ensemble> {
    return this.ensembleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateEnsembleDto: UpdateEnsembleDto,
  ): Promise<Ensemble> {
    return this.ensembleService.update(id, updateEnsembleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Ensemble> {
    return this.ensembleService.delete(id);
  }
}
