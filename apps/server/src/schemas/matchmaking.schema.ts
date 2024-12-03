import { Schema, model } from "mongoose";
import { MatchStatus } from "../utils/types/enums";

const MatchmakingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ensemble: { type: Schema.Types.ObjectId, ref: "Ensemble", required: true },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.new,
    },
    distance: { type: Number },
    seen: { type: Boolean, default: false },
    liked: { type: Boolean, required: true },
    matched_at: { type: Date, default: Date.now },
  },
  {
    collection: "Match",
    timestamps: true,
  },
);

// Makes sure that a user can only match once with the same ensemble
MatchmakingSchema.index({ user: 1, ensemble: 1 }, { unique: true });

export const Matchmaking = model("Match", MatchmakingSchema);
