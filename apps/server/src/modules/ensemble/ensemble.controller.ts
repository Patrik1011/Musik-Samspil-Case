import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";

import { EnsembleService } from "./ensemble.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateEnsembleDto } from "./dto/create-ensemble.dto";
import { UpdateEnsembleDto } from "./dto/update-ensemble.dto";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    email: string;
  };
}

@Controller("ensemble")
@ApiTags("ensemble")
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Get()
  @ApiOkResponse()
  async findAll() {
    return this.ensembleService.findAll();
  }

  @Get("hosted")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getHostedEnsembles(@Request() req: AuthenticatedRequest) {
    return this.ensembleService.findUserHostedEnsembles(req.user._id.toString());
  }

  @Get(":id")
  @ApiOkResponse()
  async findOne(@Param("id") id: string) {
    return this.ensembleService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async create(@Request() req: AuthenticatedRequest, @Body() createEnsembleDto: CreateEnsembleDto) {
    return this.ensembleService.create(createEnsembleDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async update(@Param("id") id: string, @Body() updateEnsembleDto: UpdateEnsembleDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid ensemble ID");
    }
    return this.ensembleService.update(id, updateEnsembleDto);
  }
}
