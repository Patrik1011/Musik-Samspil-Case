import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "../../schemas/post.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";

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
      return await Post.find().sort({ created_at: -1 }).populate(["ensemble_id", "author_id"]);
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

  async deletePost(id: string, userId: string) {
    const post = await Post.findById(id).populate("ensemble_id");
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const isAuthor = post.author_id.toString() === userId;
    const isHost = await EnsembleMembership.exists({
      ensemble: post.ensemble_id,
      member: userId,
      is_host: true,
    });

    if (!isAuthor && !isHost) {
      throw new ForbiddenException("Only post author or ensemble host can delete the post");
    }

    await post.deleteOne();
    return { message: "Post deleted successfully" };
  }

  async getLatestPosts() {
    try {
      return await Post.find()
        .sort({ created_at: -1 })
        .limit(6)
        .populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
