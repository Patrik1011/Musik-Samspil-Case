import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Application } from "../../schemas/application.schema";
import { Types } from "mongoose";
import { ApplicationStatus, Instrument } from "../../utils/types/enums";
import { Post } from "../../schemas/post.schema";

@Injectable()
export class ApplicationService {
  async applyForPost(postId: string, userId: string, instrument: Instrument, message?: string) {
    try {
      // Check if post exists
      const post = await Post.findById(postId);
      if (!post) {
        throw new NotFoundException("Post not found");
      }

      // Create new application
      const application = new Application({
        post: new Types.ObjectId(postId),
        applicant: new Types.ObjectId(userId),
        instrument,
        message,
        status: ApplicationStatus.pending,
      });

      await application.save();
      return application;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("You already have a pending application for this post");
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getApplicationsForPost(postId: string) {
    try {
      return await Application.find({ post: new Types.ObjectId(postId) })
        .populate("applicant", "first_name last_name email phone_number")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException(error);
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
