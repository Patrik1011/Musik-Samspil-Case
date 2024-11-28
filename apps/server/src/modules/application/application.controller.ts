import { Controller, Param, Post, UseGuards, Request, BadRequestException, Get, Patch, Body } from "@nestjs/common";
import { ApplicationService } from "./application.service";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApplicationStatus } from "../../utils/types/enums";

interface AuthenticatedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    email: string;
  };
}

@Controller("application")
@ApiTags("Application")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(":postId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async applyForPost(@Param("postId") postId: string, @Request() req: AuthenticatedRequest) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException("Invalid post ID");
    }
    return this.applicationService.applyForPost(postId, req.user._id.toString());
  }

  @Get("post/:postId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getApplicationsForPost(@Param("postId") postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException("Invalid post ID");
    }
    return this.applicationService.getApplicationsForPost(postId);
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getUserApplications(@Request() req: AuthenticatedRequest) {
    return this.applicationService.getUserApplications(req.user._id.toString());
  }

  @Patch(":applicationId/status")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async updateApplicationStatus(@Param("applicationId") applicationId: string, @Body("status") status: ApplicationStatus) {
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new BadRequestException("Invalid status");
    }
    return this.applicationService.updateApplicationStatus(applicationId, status);
  }
}
