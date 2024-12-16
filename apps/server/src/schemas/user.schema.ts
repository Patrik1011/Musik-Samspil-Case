import { Schema, model } from "mongoose";
import { Instrument } from "../utils/types/enums";

export const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: String,
    bio: String,
    instruments: [
      {
        type: String,
        enum: Object.values(Instrument),
      },
    ],
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
  },
  { collection: "User" },
);

export const User = model("User", UserSchema);
