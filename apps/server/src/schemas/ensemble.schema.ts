import { Schema, model } from "mongoose";
import { Instrument } from "../utils/types/enums";

const EnsembleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      city: String,
      country: String,
      address: String,
      coordinates: {
        type: String,
        coordinates: [Number],
      },
    },
    open_positions: [
      {
        type: String,
        enum: Object.values(Instrument),
      },
    ],
    is_active: { type: Boolean, default: true },
  },
  {
    collection: "Ensemble",
    timestamps: true,
  },
);

EnsembleSchema.index({ "location.coordinates": "2dsphere" });

export const Ensemble = model("Ensemble", EnsembleSchema);
