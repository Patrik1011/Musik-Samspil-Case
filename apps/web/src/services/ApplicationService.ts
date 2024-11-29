import { getRequest, patchRequest, postRequest } from "../utils/api.ts";
import { Instrument } from "../enums/Instrument";
import { ApplicationStatus } from "../enums/ApplicationStatus";

export interface Applicant {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface ApplicationResponse {
  _id: string;
  status: string;
  instrument: Instrument;
  applicant: Applicant;
  message?: string;
}

export interface ApplicationRequest extends Record<string, unknown> {
  instrument: Instrument;
  message?: string;
}

export const applicationService = {
  applyForPost: async (postId: string, data: ApplicationRequest) => {
    try {
      const response = await postRequest(`/application/${postId}`, data);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getApplicationsForPost: async (postId: string): Promise<ApplicationResponse[]> => {
    try {
      const response = await getRequest(`/application/post/${postId}`);
      return response as ApplicationResponse[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  changeApplicationStatus: async (applicationId: string, status: ApplicationStatus) => {
    try {
      const response = await patchRequest(`/application/${applicationId}/status`, {
        status,
      });
      return response as ApplicationResponse;
    } catch (error) {
      console.error("Error changing application status:", error);
      throw error;
    }
  },
};
