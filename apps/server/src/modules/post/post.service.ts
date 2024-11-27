import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Types } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "../../schemas/post.schema";

@Injectable()
export class PostService {
  async create(createPostDto: CreatePostDto, userId: string, ensembleId: string) {
    console.log("we get here");

    try {
      const post = await Post.create({
        ...createPostDto,
        ensemble_id: new Types.ObjectId(ensembleId),
        author_id: new Types.ObjectId(userId),
      });

      return post.populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllPosts() {
    try {
      return await Post.find().populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
