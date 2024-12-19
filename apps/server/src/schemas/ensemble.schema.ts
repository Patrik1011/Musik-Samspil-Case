import { Schema, model } from "mongoose";
import { Instrument } from "../utils/types/enums";

export const EnsembleSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      city: String,
      country: String,
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
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

// Create a single geospatial index
EnsembleSchema.index({ "location.coordinates": "2dsphere" });

export const Ensemble = model("Ensemble", EnsembleSchema);

// Drop and recreate indexes
Ensemble.collection.dropIndexes().catch((error: string) => {
  console.log("No indexes to drop or collection doesn't exist yet", error);
});
