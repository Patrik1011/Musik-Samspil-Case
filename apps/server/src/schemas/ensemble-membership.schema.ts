import { Schema, model } from "mongoose";

const EnsembleMembershipSchema = new Schema(
  {
    ensemble: { type: Schema.Types.ObjectId, ref: "Ensemble", required: true },
    ensemble_id: { type: String, required: true },
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    member_id: { type: String, required: true },
    is_host: { type: Boolean, required: true },
  },
  { collection: "EnsembleMembership" },
);

export const EnsembleMembership = model("EnsembleMembership", EnsembleMembershipSchema);
