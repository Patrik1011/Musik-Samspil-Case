import { Controller, Get, Post, Query, Body, UseGuards, Request } from "@nestjs/common";
import { MatchmakingService } from "./matchmaking.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../../utils/interfaces/AuthenticatedRequest";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@Controller("matchmaking")
@ApiTags("matchmaking")
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Get("recommendations")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getRecommendations(
    @Request() req: AuthenticatedRequest,
    @Query("latitude") latitude: string,
    @Query("longitude") longitude: string,
  ) {
    const recommendations = await this.matchmakingService.getRecommendations({
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    });

    console.log("recommendations", recommendations);

    return recommendations;
  }

  @Post("match")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async createMatch(
    @Request() req: AuthenticatedRequest,
    @Body() body: { ensembleId: string; liked: boolean },
  ) {
    return this.matchmakingService.createMatch(
      req.user._id.toString(),
      body.ensembleId,
      body.liked,
    );
  }
}
