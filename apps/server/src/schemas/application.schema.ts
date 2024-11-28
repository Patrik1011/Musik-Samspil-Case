import { Schema, model } from "mongoose";
import { Instrument, ApplicationStatus } from "../utils/types/enums";

const ApplicationSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    instrument: {
      type: String,
      enum: Object.values(Instrument),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.pending,
    },
    message: { type: String },
  },
  {
    collection: "Application",
    timestamps: true,
  },
);

ApplicationSchema.index(
  { post: 1, applicant: 1 },
  {
    unique: true,
    partialFilterExpression: { status: ApplicationStatus.pending },
  },
);

export const Application = model("Application", ApplicationSchema);
