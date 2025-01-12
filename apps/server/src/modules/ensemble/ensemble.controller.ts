import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
  Delete,
} from "@nestjs/common";
import { EnsembleService } from "./ensemble.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateEnsembleDto } from "./dto/create-ensemble.dto";
import { UpdateEnsembleDto } from "./dto/update-ensemble.dto";
import { AuthenticatedRequest } from "../../utils/interfaces/AuthenticatedRequest";



  

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

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async delete(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.ensembleService.delete(id, req.user._id.toString());
  }
}
