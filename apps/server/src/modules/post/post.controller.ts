import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";

interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    email: string;
  };
}

@Controller("post")
@ApiTags("post")
export class PostController {
  constructor(private readonly ensembleService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  async create(@Request() req: AuthenticatedRequest, @Body() createPostDto: CreatePostDto) {
    return this.ensembleService.createPostWithHost(createPostDto, req.user._id.toString());
  }

  @Get()
  @ApiOkResponse()
  async getAllPosts() {
    return this.ensembleService.getAllPosts();
  }
}
