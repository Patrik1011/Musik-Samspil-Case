import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { Application } from "../../schemas/application.schema";
import { Types, MongooseError } from "mongoose";
import { ApplicationStatus, Instrument } from "../../utils/types/enums";
import { Post } from "../../schemas/post.schema";

@Injectable()
export class ApplicationService {
  async applyForPost(postId: string, userId: string, instrument: Instrument, message?: string) {
    try {
      if (!postId || !userId || !instrument) {
        throw new BadRequestException("Missing required fields");
      }

      if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
        throw new BadRequestException("Invalid ID format");
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundException("Post not found");
      }

      const application = new Application({
        post: new Types.ObjectId(postId),
        applicant: new Types.ObjectId(userId),
        instrument,
        message,
        status: ApplicationStatus.pending,
      });

      await application.validate();
      const savedApplication = await application.save();
      return savedApplication;
    } catch (err: unknown) {
      if (err instanceof MongooseError) {
        if ("code" in err && err.code === 11000) {
          throw new ConflictException("You already have a pending application for this post");
        }
        if ("name" in err && err.name === "ValidationError") {
          throw new BadRequestException(err.message);
        }
      }

      if (err instanceof BadRequestException || err instanceof NotFoundException) {
        throw err;
      }

      console.error("Application error:", err);
      throw new InternalServerErrorException("Failed to create application");
    }
  }

  async getApplicationsForPost(postId: string) {
    try {
      if (!Types.ObjectId.isValid(postId)) {
        throw new BadRequestException("Invalid post ID");
      }

      const applications = await Application.find({ post: new Types.ObjectId(postId) })
        .populate("applicant")
        .sort({ createdAt: -1 });

      if (!applications) {
        return [];
      }

      return applications;
    } catch (err: unknown) {
      if (err instanceof MongooseError) {
        throw new InternalServerErrorException(err.message);
      }
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new InternalServerErrorException("Failed to fetch applications");
    }
  }

  async getUserApplications(userId: string) {
    try {
      return await Application.find({
        applicant: new Types.ObjectId(userId),
      }).populate("post");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changeApplicationStatus(applicationId: string, status: ApplicationStatus) {
    try {
      const application = await Application.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true },
      );

      if (!application) {
        throw new NotFoundException("Application not found");
      }

      return application;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
