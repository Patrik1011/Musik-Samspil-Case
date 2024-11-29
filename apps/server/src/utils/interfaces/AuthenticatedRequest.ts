import { Types } from "mongoose";

export interface AuthenticatedRequest {
  user: {
    _id: Types.ObjectId;
    email: string;
  };
}
