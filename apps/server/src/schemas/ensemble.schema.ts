import { Schema, model } from "mongoose";

const EnsembleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      type: Object,
      required: true,
    },
    open_positions: [String],
    is_active: { type: Boolean, default: true },
  },
  { collection: "Ensemble" },
);

export const Ensemble = model("Ensemble", EnsembleSchema);
