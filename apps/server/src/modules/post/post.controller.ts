import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../utils/interfaces/AuthenticatedRequest";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { SearchPostsDto } from "./dto/search-posts.dto";
import { PostService } from "./post.service";

@Controller("post")
@ApiTags("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOkResponse()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get("latest")
  @ApiOkResponse()
  async getLatestPosts() {
    return this.postService.getLatestPosts();
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getPostsByUserId(@Request() req: AuthenticatedRequest) {
    const userId = req.user._id.toString();
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    return this.postService.getPostsByUserId(userId);
  }

  @Get("ensemble/:ensembleId")
  @ApiOkResponse()
  async getPostsByEnsembleId(@Param("ensembleId") ensembleId: string) {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new BadRequestException("Invalid ensemble ID");
    }
    return this.postService.getPostsByEnsembleId(ensembleId);
  }

  @Post("searchPost")
  @ApiOkResponse()
  async searchPosts(@Body() searchCriteria: SearchPostsDto) {
    return this.postService.searchPosts(searchCriteria);
  }

  @Post(":ensembleId")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async create(
    @Param("ensembleId") ensembleId: string,
    @Request() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (!Types.ObjectId.isValid(ensembleId)) {
      throw new BadRequestException("Invalid ensemble ID");
    }
    return this.postService.create(createPostDto, req.user._id.toString(), ensembleId);
  }

  @Get(":id")
  @ApiOkResponse()
  async getPostById(@Param("id") postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException("Invalid post ID");
    }
    return this.postService.getPostById(postId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async delete(@Param("id") id: string, @Request() req: AuthenticatedRequest) {
    return this.postService.deletePost(id, req.user._id.toString());
  }
}
