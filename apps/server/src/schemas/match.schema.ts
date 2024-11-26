import { Schema, model } from "mongoose";
import { MatchStatus } from "../utils/types/enums";

const MatchSchema = new Schema(
  {
    searching_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    searching_user_id: { type: String, required: true },
    matched_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matched_user_id: { type: String, required: true },
    matched_at: { type: Date, default: Date.now },
    match_status: { type: String, enum: Object.values(MatchStatus), required: true },
  },
  { collection: "Match" },
);

export const Match = model("Match", MatchSchema);
