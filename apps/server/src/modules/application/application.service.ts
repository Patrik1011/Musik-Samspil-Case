import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Application } from "../../schemas/application.schema";
import { Types } from "mongoose";
import { ApplicationStatus } from "../../utils/types/enums";

@Injectable()
export class ApplicationService {
  async applyForPost(postId: string, userId: string) {
    try {
      return await Application.create({
        post_id: new Types.ObjectId(postId),
        applicant_id: new Types.ObjectId(userId),
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getApplicationsForPost(postId: string) {
    try {
      return await Application.find({ post_id: postId }).populate("applicant_id");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserApplications(userId: string) {
    try {
      return await Application.find({ applicant_id: userId }).populate("post_id");
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new NotFoundException("Application not found");
      }
      application.status = status;
      await application.save();
      return application;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
