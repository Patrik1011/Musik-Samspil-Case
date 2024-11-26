import { Schema, model } from "mongoose";
import { Instrument } from "../utils/types/enums";

const EnsembleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      type: Object,
      required: true,
    },
    open_positions: [{
      type: String,
      enum: Object.values(Instrument),
    }],
    is_active: { type: Boolean, default: true },
  },
  { collection: "Ensemble" },
);

export const Ensemble = model("Ensemble", EnsembleSchema);
