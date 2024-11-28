import { Injectable, InternalServerErrorException } from "@nestjs/common";
import mongoose, { Types } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "../../schemas/post.schema";
import { ApplicationService } from "../application/application.service";

@Injectable()
export class PostService {
  async create(createPostDto: CreatePostDto, userId: string, ensembleId: string) {
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

  async getPostById(postId: string) {
    try {
      const post = await Post.findById(postId).populate(["ensemble_id", "author_id"]);
      if (!post) {
        throw new InternalServerErrorException("Post not found");
      }
      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPostsByUserId(userId: string) {
    try {
      return await Post.find({ author_id: userId }).populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
