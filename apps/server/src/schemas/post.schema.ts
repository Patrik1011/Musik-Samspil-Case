import { Schema, model } from "mongoose";
import { PostType } from "../utils/types/enums";

const PostSchema = new Schema(
  {
    ensemble_id: { type: Schema.Types.ObjectId, ref: "Ensemble", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    website_url: { type: String, required: true },
    type: { type: String, enum: Object.values(PostType), required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "Post" },
);

export const Post = model("Post", PostSchema);
