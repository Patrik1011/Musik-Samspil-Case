import { Types } from "mongoose";

export interface OnboardingRequest {
  user: {
    _id: Types.ObjectId;
  };
}
