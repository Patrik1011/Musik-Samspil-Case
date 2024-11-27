import { Controller } from "@nestjs/common";
import { PostService } from "../post/post.service";
import { ApplicationService } from "./application.service";

@Controller("application")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
}
