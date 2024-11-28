import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
  user: {
    _id: Types.ObjectId;
    email: string;
  };
}

@Controller("post")
@ApiTags("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @Get()
  @ApiOkResponse()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(":id")
  //@UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getPostById(@Param("id") postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException("Invalid post ID");
    }
    return this.postService.getPostById(postId);
  }

  @Get("user/posts")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async getPostsByUserId(@Request() req: AuthenticatedRequest) {
    const userId = req.user._id.toString();
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    return this.postService.getPostsByUserId(userId);
  }
}
