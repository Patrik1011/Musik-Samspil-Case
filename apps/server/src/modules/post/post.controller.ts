import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";

@Controller("post")
@ApiTags("post")
export class PostController {
  constructor(private readonly ensembleService: PostService) {}
}
