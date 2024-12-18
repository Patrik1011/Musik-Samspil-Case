import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Ensemble } from "src/schemas/ensemble.schema";
import { Application } from "../../schemas/application.schema";
import { EnsembleMembership } from "../../schemas/ensemble-membership.schema";
import { Post } from "../../schemas/post.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { MongoSearchPostsDto, SearchPostsDto } from "./dto/search-posts.dto";

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
    await Application.deleteMany({ post_id: post._id });

    return { message: "Post deleted successfully" };
  }

  async getLatestPosts() {
    try {
      return await Post.find().sort({ created_at: -1 }).limit(6).populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchPosts(searchCriteria: SearchPostsDto) {
    try {
      const query: MongoSearchPostsDto = {};

      // Handle instrument filtering
      if (searchCriteria.instrument) {
        const matchingEnsembleIds = await Ensemble.find({ open_positions: searchCriteria.instrument }, { _id: 1 }).lean();

        const ensembleIds = matchingEnsembleIds.map(ensemble => ensemble._id);
        query.ensemble_id = { $in: ensembleIds };
      }

      // Handle location filtering
      if (searchCriteria.location) {
        const locationPattern = new RegExp(searchCriteria.location, "i");

        const matchingEnsembleIds = await Ensemble.find(
          {
            $or: [{ "location.city": locationPattern }, { "location.country": locationPattern }, { "location.address": locationPattern }],
          },
          { _id: 1 },
        ).lean();

        const ensembleIds = matchingEnsembleIds.map(ensemble => ensemble._id);
        query.ensemble_id = { $in: ensembleIds };
      }

      if (searchCriteria.genericText) {
        // Generic text search for title and description
        const genericTextRegex = { $regex: searchCriteria.genericText as string, $options: "i" };

        type QueryCondition =
          | { title?: { $regex: string; $options: string } }
          | { description?: { $regex: string; $options: string } }
          | { type?: { $regex: string; $options: string } }
          | { ensemble_id?: { $in: Types.ObjectId[] } };

        // Add initial $or conditions for title and description
        const genericTextConditions: QueryCondition[] = [{ title: genericTextRegex }, { description: genericTextRegex }, { type: genericTextRegex }];

        // Fetch ensemble IDs based on location criteria
        const locationPattern = genericTextRegex;
        const locationCriteria = {
          $or: [{ "location.city": locationPattern }, { "location.country": locationPattern }, { "location.address": locationPattern }],
        };
        const matchingLocationEnsembles = await Ensemble.find(locationCriteria, { _id: 1 }).lean();
        const locationEnsembleIds = matchingLocationEnsembles.map(ensemble => ensemble._id);

        // Fetch ensemble IDs based on open positions
        const openPositionsCriteria = { open_positions: genericTextRegex };
        const matchingPositionEnsembles = await Ensemble.find(openPositionsCriteria, { _id: 1 }).lean();
        const positionEnsembleIds = matchingPositionEnsembles.map(ensemble => ensemble._id);

        // Combine ensemble IDs from both location and open positions
        const combinedEnsembleIds = [...new Set([...locationEnsembleIds, ...positionEnsembleIds])];

        // Add ensemble-related conditions if any ensemble IDs were found
        if (combinedEnsembleIds.length > 0) {
          genericTextConditions.push({ ensemble_id: { $in: combinedEnsembleIds } });
        }

        // Apply the combined $or conditions to the query
        query.$or = genericTextConditions;
      }

      // Add additional filters dynamically
      if (searchCriteria.title) {
        query.title = { $regex: searchCriteria.title, $options: "i" };
      }
      if (searchCriteria.description) {
        query.description = { $regex: searchCriteria.description, $options: "i" };
      }
      if (searchCriteria.type) {
        query.type = searchCriteria.type;
      }

      return await Post.find(query).populate(["ensemble_id", "author_id"]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
