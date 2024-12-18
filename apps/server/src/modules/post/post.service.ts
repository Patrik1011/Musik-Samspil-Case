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

  // Function to handle instrument-based search
  async searchByInstrument(instrument: string): Promise<Types.ObjectId[]> {
    const matchingEnsembles = await Ensemble.find({ open_positions: instrument }, { _id: 1 }).lean();

    return matchingEnsembles.map(ensemble => ensemble._id);
  }

  // Function to handle location-based search
  async searchByLocation(location: string): Promise<Types.ObjectId[]> {
    const locationPattern = new RegExp(location, "i");

    const matchingEnsembles = await Ensemble.find(
      {
        $or: [{ "location.city": locationPattern }, { "location.country": locationPattern }, { "location.address": locationPattern }],
      },
      { _id: 1 },
    ).lean();

    return matchingEnsembles.map(ensemble => ensemble._id);
  }

  // Function to handle generic text search
  async searchByGenericText(genericText: string | { $regex: string; $options: string }): Promise<Types.ObjectId[]> {
    const genericTextRegex = { $regex: genericText, $options: "i" };

    // Fetch ensembles based on generic text in location or open positions
    const locationCriteria = {
      $or: [{ "location.city": genericTextRegex }, { "location.country": genericTextRegex }, { "location.address": genericTextRegex }],
    };
    const openPositionsCriteria = { open_positions: genericTextRegex };

    const [matchingLocationEnsembles, matchingPositionEnsembles] = await Promise.all([
      Ensemble.find(locationCriteria, { _id: 1 }).lean(),
      Ensemble.find(openPositionsCriteria, { _id: 1 }).lean(),
    ]);

    const locationEnsembleIds = matchingLocationEnsembles.map(ensemble => ensemble._id);
    const positionEnsembleIds = matchingPositionEnsembles.map(ensemble => ensemble._id);

    return [...new Set([...locationEnsembleIds, ...positionEnsembleIds])];
  }

  async searchPosts(searchCriteria: SearchPostsDto) {
    try {
      const query: MongoSearchPostsDto = {};

      // Handle instrument filtering
      if (searchCriteria.instrument) {
        const ensembleIds = await this.searchByInstrument(searchCriteria.instrument);
        query.ensemble_id = { $in: ensembleIds };
      }

      // Handle location filtering
      if (searchCriteria.location) {
        const ensembleIds = await this.searchByLocation(searchCriteria.location);
        query.ensemble_id = { $in: ensembleIds };
      }

      if (searchCriteria.genericText) {
        const genericTextRegex = { $regex: searchCriteria.genericText as string, $options: "i" };

        type QueryCondition =
          | { title?: { $regex: string; $options: string } }
          | { description?: { $regex: string; $options: string } }
          | { type?: { $regex: string; $options: string } }
          | { ensemble_id?: { $in: Types.ObjectId[] } };

        const genericTextConditions: QueryCondition[] = [{ title: genericTextRegex }, { description: genericTextRegex }, { type: genericTextRegex }];

        const locationEnsembleIds = await this.searchByLocation(searchCriteria.genericText as string);
        const positionEnsembleIds = await this.searchByInstrument(searchCriteria.genericText as string);
        const combinedEnsembleIds = [...new Set([...locationEnsembleIds, ...positionEnsembleIds])];

        if (combinedEnsembleIds.length > 0) {
          genericTextConditions.push({ ensemble_id: { $in: combinedEnsembleIds } });
        }
        query.$or = genericTextConditions;
      }

      // Additional filters dynamically
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
