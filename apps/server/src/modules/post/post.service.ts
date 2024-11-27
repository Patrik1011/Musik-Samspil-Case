import { Injectable, InternalServerErrorException } from "@nestjs/common";
import mongoose from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "../../schemas/post.schema";

@Injectable()
export class PostService {
  async createPostWithHost(createPostDto: CreatePostDto, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const post = await Post.create(
        [
          {
            ensemble: new mongoose.Types.ObjectId(createPostDto.ensemble_id),
            ensemble_id: createPostDto.ensemble_id,
            title: createPostDto.title,
            description: createPostDto.description,
            website_url: createPostDto.website_url,
            type: createPostDto.type,
            author: new mongoose.Types.ObjectId(createPostDto.author_id),
            author_id: createPostDto.author_id,
            created_at: new Date(),
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return post[0];
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await session.endSession();
    }
  }

  async getAllPosts() {
    try {
      return await Post.find().populate(["ensemble", "author"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
