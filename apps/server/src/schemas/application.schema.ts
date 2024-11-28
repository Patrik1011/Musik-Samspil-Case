import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    applicant_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "Application" },
);

export const Application = model("Application", ApplicationSchema);
