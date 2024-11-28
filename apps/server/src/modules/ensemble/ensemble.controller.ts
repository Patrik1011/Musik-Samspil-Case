import { Controller, Get, Post, Body, Param, UseGuards, Request, Put } from "@nestjs/common";
import { EnsembleService } from "./ensemble.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateEnsembleDto } from "./dto/create-ensemble.dto";
import { UpdateEnsembleDto } from "./dto/update-ensemble.dto";
import { AuthenticatedRequest } from "../../utils/interfaces/AuthenticatedRequest";

@Controller("ensemble")
@ApiTags("ensemble")
export class EnsembleController {
  constructor(private readonly ensembleService: EnsembleService) {}

  @Get("hosted")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getHostedEnsembles(@Request() req: AuthenticatedRequest) {
    console.log(`Fetching hosted ensembles for user: ${req.user._id.toString()}`);
    return this.ensembleService.findUserHostedEnsembles(req.user._id.toString());
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getEnsemble(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.ensembleService.findOne(id, req.user._id.toString());
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async create(@Request() req: AuthenticatedRequest, @Body() createEnsembleDto: CreateEnsembleDto) {
    return this.ensembleService.createWithHost(createEnsembleDto, req.user._id.toString());
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async update(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updateEnsembleDto: UpdateEnsembleDto,
  ) {
    return this.ensembleService.update(id, updateEnsembleDto, req.user._id.toString());
  }
}
